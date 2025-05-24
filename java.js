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

    form.addEventListener('submit', function(e) {
        errorDiv.textContent = '';
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const phone = form.elements['phone'].value.trim();
        const message = form.elements['message'].value.trim();
        const consent = form.elements['consent'].checked;

        // Имя: минимум 2 буквы
        if (!/^[а-яА-ЯёЁa-zA-Z\s-]{2,}$/.test(name)) {
            e.preventDefault();
            errorDiv.textContent = 'Введите корректное имя (минимум 2 буквы).';
            return;
        }
        // Телефон: только цифры, минимум 10 символов
        if (!/^\d{10,}$/.test(phone)) {
            e.preventDefault();
            errorDiv.textContent = 'Введите корректный номер телефона (только цифры, минимум 10).';
            return;
        }
        // Email: стандартная HTML5-валидация
        if (!email) {
            e.preventDefault();
            errorDiv.textContent = 'Введите корректный email.';
            return;
        }
        // Сообщение: минимум 5 символов
        if (message.length < 5) {
            e.preventDefault();
            errorDiv.textContent = 'Сообщение должно содержать минимум 5 символов.';
            return;
        }
        // Согласие
        if (!consent) {
            e.preventDefault();
            errorDiv.textContent = 'Пожалуйста, дайте согласие на обработку данных.';
            return;
        }
        // Если всё ок — форма отправится на Formspree
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
