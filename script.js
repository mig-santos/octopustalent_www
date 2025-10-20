document.addEventListener('DOMContentLoaded', function() {
    // Language switcher based on domain
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    const lang = isPortuguese ? 'pt' : 'en';

    // Update text content
    document.querySelectorAll('[data-en][data-pt]').forEach(element => {
        // Handle the site title <p> tag as well
        if (element.tagName === 'P' && element.classList.contains('site-title')) {
            element.textContent = element.getAttribute(`data-${lang}`);
        } else if (element.tagName !== 'TITLE') {
             // Avoid changing the title tag's textContent directly here
             element.textContent = element.getAttribute(`data-${lang}`);
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update meta language tag
    document.querySelector('meta[name="language"]').setAttribute('content', lang);

    // Update title
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleElement.textContent = titleElement.getAttribute(`data-${lang}`);
    }

    // Form submission handler
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // FIX: Added 'form.subject.value' to the validation check
            if (form.name.value && form.email.value && form.subject.value && form.message.value) {
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
