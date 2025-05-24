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

    form.addEventListener('submit', function(e) {
        errorDiv.textContent = '';
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const phone = form.elements['phone'].value.trim();
        const message = form.elements['message'].value.trim();
        const consent = form.elements['consent'].checked;

        if (!name || !email || !phone || !message) {
            e.preventDefault();
            errorDiv.textContent = 'Пожалуйста, заполните все поля формы.';
            return;
        }
        if (!consent) {
            e.preventDefault();
            errorDiv.textContent = 'Пожалуйста, дайте согласие на обработку данных.';
            return;
        }
        // Если всё ок — форма отправится на Formspree
    });
});
