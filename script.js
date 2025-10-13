document.addEventListener('DOMContentLoaded', function() {
    // Language switcher based on domain
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    const lang = isPortuguese ? 'pt' : 'en';

    // Update text content
    document.querySelectorAll('[data-en][data-pt]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update meta language tag
    document.querySelector('meta[name="language"]').setAttribute('content', lang);

    // Update title
    const titleElement = document.querySelector('title');
    titleElement.textContent = titleElement.getAttribute(`data-${lang}`);

    // Form submission handler
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (form.name.value && form.email.value && form.message.value) {
                const message = isPortuguese 
                    ? 'Obrigado pela sua mensagem! Entraremos em contato em breve.'
                    : 'Thank you for your message! We will get back to you soon.';
                alert(message);
                form.reset();
            } else {
                const message = isPortuguese 
                    ? 'Por favor, preencha todos os campos obrigatórios.'
                    : 'Please fill in all required fields.';
                alert(message);
            }
        });
    }
});