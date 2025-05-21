document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const consentCheckbox = document.getElementById('consent');
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const formInputs = form.querySelectorAll('input, textarea');

    // Функция для отображения сообщений
    function showMessage(message, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        
        // Удаляем предыдущее сообщение, если оно есть
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        form.insertBefore(messageDiv, form.firstChild);
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Функция валидации email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Функция валидации телефона
    function validatePhone(phone) {
        // Удаляем все нецифровые символы
        phone = phone.replace(/[^0-9]/g, '');
        
        // Проверяем длину номера (должно быть 10 или 11 цифр)
        if (phone.length < 10 || phone.length > 11) {
            return false;
        }
        
        // Если номер начинается с 8 или 7, убираем эту цифру
        if (phone.length === 11) {
            if (phone[0] === '8' || phone[0] === '7') {
                phone = phone.substring(1);
            } else {
                return false;
            }
        }
        
        
        const operatorCode = phone.substring(0, 3);
        return validOperators.includes(operatorCode);
    }

    // Функция валидации имени
    function validateName(name) {
        return name.length >= 2 && /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(name);
    }

    // Функция валидации сообщения
    function validateMessage(message) {
        return message.length >= 10;
    }

    // Добавляем валидацию при вводе для каждого поля
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            let isValid = true;
            let errorMessage = '';

            switch(this.name) {
                case 'name':
                    isValid = validateName(this.value);
                    errorMessage = 'Имя должно содержать минимум 2 символа и только буквы';
                    break;
                case 'email':
                    isValid = validateEmail(this.value);
                    errorMessage = 'Введите корректный email адрес';
                    break;
                case 'phone':
                    isValid = validatePhone(this.value);
                    errorMessage = 'Введите корректный номер телефона (например: +7 (999) 123-45-67)';
                    break;
                case 'message':
                    isValid = validateMessage(this.value);
                    errorMessage = 'Сообщение должно содержать минимум 10 символов';
                    break;
            }

            // Обновляем стиль поля в зависимости от валидности
            this.classList.toggle('invalid', !isValid);
            this.classList.toggle('valid', isValid && this.value !== '');

            // Показываем/скрываем сообщение об ошибке
            let errorElement = this.nextElementSibling;
            if (!isValid) {
                if (!errorElement || !errorElement.classList.contains('error-message')) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    this.parentNode.insertBefore(errorElement, this.nextSibling);
                }
                errorElement.textContent = errorMessage;
            } else if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        });
    });

    // Обработчик изменения чекбокса согласия
    consentCheckbox.addEventListener('change', function() {
        submitButton.disabled = !consentCheckbox.checked;
    });

    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Проверяем валидность всех полей
        let isValid = true;
        formInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('invalid');
            }
        });

        if (!isValid) {
            showMessage('Пожалуйста, заполните все поля формы', true);
            return;
        }

        // Проверяем согласие
        if (!consentCheckbox.checked) {
            showMessage('Необходимо дать согласие на обработку данных', true);
            return;
        }

        // Показываем состояние загрузки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        submitButton.classList.add('loading');

        try {
            const formData = new FormData(form);
            const response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            if (response.ok) {
                showMessage('Спасибо! Ваше сообщение успешно отправлено.');
                form.reset();
                formInputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                consentCheckbox.checked = false;
                submitButton.disabled = true;
            } else {
                throw new Error(result || 'Произошла ошибка при отправке формы');
            }
        } catch (error) {
            showMessage(error.message, true);
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitButton.disabled = !consentCheckbox.checked;
            submitButton.textContent = 'Отправить';
            submitButton.classList.remove('loading');
        }
    });

    // Добавляем обработчики событий для плавной прокрутки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
