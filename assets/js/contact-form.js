// ===============================================
// CONTACT FORM HANDLER
// ===============================================

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            console.log('📧 Contact form handler initialized');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            // For Netlify Forms or custom endpoint
            const response = await this.submitForm(data);
            
            if (response.success) {
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
            } else {
                this.showMessage('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showMessage('An error occurred. Please try again later.', 'error');
        }

        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }

    async submitForm(data) {
        // For Netlify Forms, we'll use the built-in form handling
        if (window.location.hostname.includes('netlify') || !this.isDevelopment()) {
            // Use Netlify Forms
            const form = new FormData();
            form.append('form-name', 'contact');
            Object.keys(data).forEach(key => {
                form.append(key, data[key]);
            });

            const response = await fetch('/', {
                method: 'POST',
                body: form
            });

            return { success: response.ok };
        } else {
            // Development mode - simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
        }
    }

    showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status-message status-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;

        // Insert after the form
        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);

        console.log(`📧 Contact form message: ${type} - ${message}`);
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactFormHandler();
    
    // Export for admin panel integration if needed
    window.contactFormHandler = contactForm;
});

// Form message styles
const formMessageStyles = `
.form-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;
    animation: slideInFromTop 0.3s ease-out;
    transition: opacity 0.3s ease;
}
`;

// Inject styles
const contactFormStyleSheet = document.createElement('style');
contactFormStyleSheet.textContent = formMessageStyles;
document.head.appendChild(contactFormStyleSheet);