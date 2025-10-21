// Use async function for the event listener to allow 'await'
document.addEventListener('DOMContentLoaded', async function() {
    
    // Determine language
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    //const isPortuguese = true; // Forcing Portuguese
    //const isPortuguese = false; // Forcing English
    
    const lang = isPortuguese ? 'pt' : 'en';

    // Set HTML lang attributes immediately
    document.documentElement.lang = lang;
    document.querySelector('meta[name="language"]').setAttribute('content', lang);

    // Helper function to get nested values from JSON
    // e.g., getString(strings, "nav.home") -> "Home"
    function getString(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    }

    try {
        // 1. Fetch the string file
        const response = await fetch(`strings/${lang}.json`); // e.g., en.json
        if (!response.ok) {
            throw new Error('Language file not found');
        }
        const strings = await response.json();

        // 2. Populate all elements with a data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            const value = getString(strings, key);
            
            if (value) {
                // Handle different element types
                if (element.tagName === 'TITLE') {
                    element.textContent = value;
                } else {
                    element.textContent = value;
                }
            } else {
                console.warn(`Missing string for key: ${key}`);
                element.textContent = key; // Show the key as a fallback
            }
        });

        // 3. Update form handler
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                if (form.name.value && form.email.value && form.subject.value && form.message.value) {
                    // Get alert strings from the loaded JSON
                    alert(getString(strings, 'contactPage.alerts.success'));
                    form.reset();
                } else {
                    // Get alert strings from the loaded JSON
                    alert(getString(strings, 'contactPage.alerts.error'));
                }
            });
        }

    } catch (error) {
        console.error('Failed to load language file:', error);
        // Fallback: show an error
        document.body.innerHTML = 'Error loading page content. Please try again later.';
    }
});