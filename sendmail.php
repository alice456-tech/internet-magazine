<?php
// Защита от CSRF
session_start();
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    http_response_code(403);
    echo json_encode(['error' => 'Ошибка безопасности: недействительный токен']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем и очищаем данные
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);

    // Валидация данных
    $errors = [];
    
    // Проверка имени (2-50 символов)
    if (empty($name) || strlen($name) < 2 || strlen($name) > 50) {
        $errors[] = "Имя должно содержать от 2 до 50 символов";
    }

    // Проверка email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Пожалуйста, введите корректный email";
    }

    // Проверка телефона (российский формат)
    if (empty($phone) || !preg_match('/^(\+7|8)[0-9]{10}$/', preg_replace('/[^0-9+]/', '', $phone))) {
        $errors[] = "Пожалуйста, введите корректный номер телефона";
    }

    // Проверка сообщения (10-1000 символов)
    if (empty($message) || strlen($message) < 10 || strlen($message) > 1000) {
        $errors[] = "Сообщение должно содержать от 10 до 1000 символов";
    }

    // Если есть ошибки, возвращаем их
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit;
    }

    // Защита от спама (проверка времени между отправками)
    if (isset($_SESSION['last_submit_time']) && time() - $_SESSION['last_submit_time'] < 60) {
        http_response_code(429);
        echo json_encode(['error' => 'Пожалуйста, подождите минуту перед следующей отправкой']);
        exit;
    }

    // Устанавливаем адрес получателя
    $recipient = "dolgonenko198@gmail.com";

    // Формируем тему письма
    $subject = "Новое сообщение с сайта от " . $name;

    // Формируем тело письма
    $email_content = "Имя: " . $name . "\n";
    $email_content .= "Email: " . $email . "\n";
    $email_content .= "Телефон: " . $phone . "\n\n";
    $email_content .= "Сообщение:\n" . $message . "\n";
    $email_content .= "\n---\nОтправлено с сайта: " . $_SERVER['HTTP_HOST'];

    // Устанавливаем заголовки
    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    try {
        // Пытаемся отправить письмо
        if (mail($recipient, $subject, $email_content, $headers)) {
            // Обновляем время последней отправки
            $_SESSION['last_submit_time'] = time();
            
            http_response_code(200);
            echo json_encode(['success' => 'Спасибо! Ваше сообщение отправлено.']);
        } else {
            throw new Exception('Ошибка отправки письма');
        }
    } catch (Exception $e) {
        // Логируем ошибку
        error_log("Ошибка отправки формы: " . $e->getMessage());
        
        http_response_code(500);
        echo json_encode(['error' => 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.']);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается. Используйте POST-запрос.']);
}
?>