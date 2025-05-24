document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Создаем div для ошибок, если его нет
    let errorDiv = document.getElementById('form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
    }

    // Кнопка отправки неактивна без согласия
    const consentCheckbox = form.elements['consent'];
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = !consentCheckbox.checked;
    consentCheckbox.addEventListener('change', function() {
        submitButton.disabled = !consentCheckbox.checked;
    });

    // Валидация email
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Валидация телефона (разрешить любые символы, но минимум 10 цифр)
    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }

    // Валидация имени (только буквы, пробелы, дефисы, 2-50 символов)
    function validateName(name) {
        return /^[а-яА-ЯёЁa-zA-Z\s-]{2,50}$/.test(name);
    }

    // Валидация сообщения (10-1000 символов)
    function validateMessage(msg) {
        return msg.length >= 10 && msg.length <= 1000;
    }

    form.addEventListener('submit', function(e) {
        errorDiv.textContent = '';
        let hasError = false;

        const name = form.elements['name'];
        const email = form.elements['email'];
        const phone = form.elements['phone'];
        const message = form.elements['message'];
        const consent = form.elements['consent'].checked;

        // Сброс классов
        [name, email, phone, message].forEach(f => {
            f.classList.remove('valid', 'invalid');
        });

        // Проверка имени
        if (!validateName(name.value.trim())) {
            name.classList.add('invalid');
            errorDiv.textContent = 'Имя должно содержать только буквы, пробелы или дефисы (2-50 символов).';
            hasError = true;
        } else {
            name.classList.add('valid');
        }

        // Проверка email
        if (!hasError && !validateEmail(email.value.trim())) {
            email.classList.add('invalid');
            errorDiv.textContent = 'Введите корректный email.';
            hasError = true;
        } else if (!hasError) {
            email.classList.add('valid');
        }

        // Проверка телефона
        if (!hasError && !validatePhone(phone.value.trim())) {
            phone.classList.add('invalid');
            errorDiv.textContent = 'Введите корректный номер телефона (минимум 10 цифр).';
            hasError = true;
        } else if (!hasError) {
            phone.classList.add('valid');
        }

        // Проверка сообщения
        if (!hasError && !validateMessage(message.value.trim())) {
            message.classList.add('invalid');
            errorDiv.textContent = 'Сообщение должно содержать от 10 до 1000 символов.';
            hasError = true;
        } else if (!hasError) {
            message.classList.add('valid');
        }

        // Проверка согласия
        if (!hasError && !consent) {
            errorDiv.textContent = 'Пожалуйста, дайте согласие на обработку данных.';
            hasError = true;
        }

        if (hasError) {
            e.preventDefault();
        }
    });

    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
