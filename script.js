// Use async function for the event listener to allow 'await'
document.addEventListener('DOMContentLoaded', async function() {
    
    // Determine language
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    const lang = isPortuguese ? 'pt' : 'en';

    // Set HTML lang attributes immediately
    document.documentElement.lang = lang;
    document.querySelector('meta[name="language"]').setAttribute('content', lang);

    // --- Formspree Form IDs ---
    // !! IMPORTANT: Replace with your actual Formspree IDs !!
    const formId_EU = 'xanpzvwo'; // The ID for octopustalent.eu
    const formId_PT = 'xnngylrp'; // The ID for octopustalent.pt
    
    // Choose the correct ID based on the language
    const formId = isPortuguese ? formId_PT : formId_EU;


    // Helper function to get nested values from JSON
    function getString(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    }

    try {
        // 1. Fetch the string file
        const response = await fetch(`strings/${lang}.json`); // e.g., strings/en.json
        if (!response.ok) {
            throw new Error('Language file not found');
        }
        const strings = await response.json();

        // 2. Populate all elements with a data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            
            // Set text content or placeholder
            if (key) {
                const value = getString(strings, key);
                if (value) {
                    const tagName = element.tagName;
                    if (tagName === 'TITLE') {
                        element.textContent = value;
                    } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                        element.placeholder = value;
                    } else {
                        element.textContent = value;
                    }
                } else {
                    console.warn(`Missing string for key: ${key}`);
                    element.textContent = key; // Show the key as a fallback
                }
            }

            // --- NEW: Set href attribute ---
            const hrefKey = element.getAttribute('data-href-key');
            if (hrefKey) {
                const hrefValue = getString(strings, hrefKey);
                if (hrefValue) {
                    element.href = hrefValue;
                }
            }
            // --- End of new code ---
        });

        // 3. Update form handler
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        
        if (form && formStatus) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Get strings for status messages
                const sendingMsg = getString(strings, 'contactPage.formStatus.sending');
                const successMsg = getString(strings, 'contactPage.formStatus.success');
                const errorMsg = getString(strings, 'contactPage.formStatus.error');
                
                // Show "Sending..." message
                formStatus.textContent = sendingMsg;
                formStatus.className = 'info'; 
                formStatus.style.display = 'block';

                const formData = new FormData(form);
                
                try {
                    const response = await fetch(`https://formspree.io/f/${formId}`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Show success message
                        formStatus.textContent = successMsg;
                        formStatus.className = 'success';
                        form.reset(); // Clear the form
                    } else {
                        // Show server error message
                        formStatus.textContent = errorMsg;
                        formStatus.className = 'error';
                    }
                } catch (error) {
                    // Show network error message
                    console.error('Form submission error:', error);
                    formStatus.textContent = errorMsg;
                    formStatus.className = 'error';
                }
            });
        }

    } catch (error) {
        console.error('Failed to load language file:', error);
        // Fallback: show an error
        document.body.innerHTML = 'Error loading page content. Please try again later.';
    }
});

