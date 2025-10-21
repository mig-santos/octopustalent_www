// Use async function for the event listener to allow 'await'
document.addEventListener('DOMContentLoaded', async function() {
    
    // Determine language
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    //const isPortuguese = true; // Forcing Portuguese
    //const isPortuguese = false; // Forcing English
    
    const lang = isPortuguese ? 'pt' : 'en';

    // Set HTML lang attributes immediately
    document.documentElement.lang = lang;
    const metaLang = document.querySelector('meta[name="language"]');
    if (metaLang) {
        metaLang.setAttribute('content', lang);
    }

    // Helper function to get nested values from JSON
    function getString(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    }

    try {
        // 1. Fetch the string file
        const response = await fetch(`strings/${lang}.json`);
        if (!response.ok) {
            throw new Error('Language file not found');
        }
        const strings = await response.json();

        // 2. Populate all elements with a data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            const value = getString(strings, key);
            
            if (value) {
                element.textContent = value;
            } else {
                console.warn(`Missing string for key: ${key}`);
                element.textContent = key; // Show the key as a fallback
            }
        });

        // 3. Handle form submission with AJAX
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        if (form && formStatus) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent; // Store original text

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const sendingText = getString(strings, 'contactPage.formStatus.sending');
                const successText = getString(strings, 'contactPage.formStatus.success');
                const errorText = getString(strings, 'contactPage.formStatus.error');
                
                // Update UI to show submission is in progress
                submitButton.textContent = sendingText;
                submitButton.disabled = true;
                formStatus.className = '';
                formStatus.textContent = '';

                const formData = new FormData(form);
                
                try {
                    // IMPORTANT: Replace YOUR_FORM_ID with your actual Formspree ID
                    const response = await fetch('https://formspree.io/f/mvgwndpk', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        formStatus.textContent = successText;
                        formStatus.className = 'success';
                        form.reset();
                    } else {
                        throw new Error('Server responded with an error');
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    formStatus.textContent = errorText;
                    formStatus.className = 'error';
                } finally {
                    // Restore button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            });
        }

    } catch (error) {
        console.error('Failed to load language file:', error);
        document.body.innerHTML = '<p style="text-align: center; padding: 50px;">Error loading page content. Please try again later.</p>';
    }
});
