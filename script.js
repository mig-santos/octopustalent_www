// script.js
// Simple JavaScript for form submission alert (since no backend is specified, this simulates sending).
// Also includes a basic mobile menu toggle if needed, but since nav is simple, it's optional.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Basic validation
            if (form.name.value && form.email.value && form.message.value) {
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});