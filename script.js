// Use async function for the event listener to allow 'await'
document.addEventListener('DOMContentLoaded', async function() {
    
    // Determine language
    const isPortuguese = window.location.hostname.includes('octopustalent.pt');
    const lang = isPortuguese ? 'pt' : 'en';

    // Set HTML lang attributes immediately
    document.documentElement.lang = lang;
    document.querySelector('meta[name="language"]').setAttribute('content', lang);

    // --- Formspree Form IDs ---
    const formId_EU = 'xanpzvwo';
    const formId_PT = 'xnngylrp';
    const formId = isPortuguese ? formId_PT : formId_EU;

    // Helper function to get nested values from JSON
    function getString(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    }

    try {
        const response = await fetch(`strings/${lang}.json`);
        if (!response.ok) throw new Error('Language file not found');
        const strings = await response.json();

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (key) {
                const value = getString(strings, key);
                if (value) {
                    if (element.tagName === 'TITLE') {
                        element.textContent = value;
                    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = value;
                    } else {
                        element.textContent = value;
                    }
                } else {
                    console.warn(`Missing string for key: ${key}`);
                    element.textContent = key;
                }
            }

            const hrefKey = element.getAttribute('data-href-key');
            if (hrefKey) {
                const hrefValue = getString(strings, hrefKey);
                if (hrefValue) element.href = hrefValue;
            }
        });

        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        
        if (form && formStatus) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const sendingMsg = getString(strings, 'contactPage.formStatus.sending');
                const successMsg = getString(strings, 'contactPage.formStatus.success');
                const errorMsg = getString(strings, 'contactPage.formStatus.error');
                
                formStatus.textContent = sendingMsg;
                formStatus.className = 'info'; 
                formStatus.style.display = 'block';

                const formData = new FormData(form);
                
                try {
                    const response = await fetch(`https://formspree.io/f/${formId}`, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        formStatus.textContent = successMsg;
                        formStatus.className = 'success';
                        form.reset();
                    } else {
                        formStatus.textContent = errorMsg;
                        formStatus.className = 'error';
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    formStatus.textContent = errorMsg;
                    formStatus.className = 'error';
                }
            });
        }

    } catch (error) {
        console.error('Failed to load language file:', error);
        document.body.innerHTML = 'Error loading page content. Please try again later.';
    }

    // ───────────────────────────────────────────────
    // Mobile menu (hamburger) logic
    // ───────────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-menu a');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburger.setAttribute('aria-expanded', 'true');
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
            });
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ───────────────────────────────────────────────
    // Smooth scroll + active link on click
    // ───────────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const headerOffset = 100; // ← tune this to your header height + buffer

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // Instant active style on click
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Re-check after smooth scroll settles
            setTimeout(updateActiveLink, 600);
        });
    });

    // ───────────────────────────────────────────────
    // Scroll-based active section highlighting
    // ───────────────────────────────────────────────

    function updateActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= headerOffset + 20 && sectionTop > -200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => link.classList.remove('active'));

        if (current) {
            const activeLink = document.querySelector(`a[href="#${current}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
        // Near top → force first section
        else if (window.scrollY < 300) {
            const firstLink = document.querySelector('a[href="#what-we-do"]');
            if (firstLink) firstLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run once on load

    // Force first section (redundant but safe)
    const firstSection = document.querySelector('section[id]:first-of-type');
    if (firstSection && firstSection.id) {
        const id = firstSection.id;
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
});