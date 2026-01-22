// ===============================================
// CONTACT FORM HANDLER
// ===============================================

/**
 * Handles contact form submission with validation and feedback
 * @class ContactFormHandler
 */
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    /**
     * Initializes the contact form handler
     */
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    /**
     * Handles form submission
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        // Get and validate form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            const response = await this.submitForm(data);
            
            if (response.success) {
                this.showMessage(
                    'Message sent successfully! I\'ll get back to you soon.', 
                    'success'
                );
                this.form.reset();
            } else {
                this.showMessage(
                    'Failed to send message. Please try again.', 
                    'error'
                );
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showMessage(
                'An error occurred. Please try again later.', 
                'error'
            );
        } finally {
            // Reset button state
            this.setButtonLoading(submitBtn, false, originalText);
        }
    }

    /**
     * Sets button loading state
     * @param {Element} button - Button element
     * @param {boolean} loading - Loading state
     * @param {string} originalText - Original button text
     */
    setButtonLoading(button, loading, originalText = null) {
        if (loading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            button.disabled = true;
        } else {
            button.innerHTML = originalText || button.innerHTML;
            button.disabled = false;
        }
    }

    /**
     * Submits form data to server using Web3Forms
     * @param {Object} data - Form data
     * @returns {Promise<Object>} Response object with success status
     */
    async submitForm(data) {
        // Web3Forms - Works on any hosting
        // Get your free access key from: https://web3forms.com/
        const WEB3FORMS_ACCESS_KEY = '8a34bbd4-78d9-4a92-a6bc-e11244985839';

        // Check if access key is configured
        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
            console.warn('⚠️ Web3Forms access key not configured.');
            this.fallbackToMailto(data);
            return { success: true, fallback: true };
        }

        const formData = {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: data.name,
            email: data.email,
            subject: data.subject || 'New Contact Form Submission',
            message: data.message,
            from_name: 'Hasan Arthur Portfolio',
            // Spam protection
            botcheck: ''
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            return { success: result.success };
        } catch (error) {
            console.error('Web3Forms error:', error);
            // Fallback to mailto on error
            this.fallbackToMailto(data);
            return { success: true, fallback: true };
        }
    }

    /**
     * Fallback to mailto if form service unavailable
     * @param {Object} data - Form data
     */
    fallbackToMailto(data) {
        const subject = encodeURIComponent(data.subject || 'Contact from Portfolio');
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        );
        window.location.href = `mailto:hasannarthurrr@gmail.com?subject=${subject}&body=${body}`;
    }

    /**
     * Displays feedback message to user
     * @param {string} message - Message text
     * @param {string} type - Message type ('success' or 'error')
     */
    showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status-message status-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'exclamation-triangle';
        messageDiv.innerHTML = `
            <i class="fas fa-${icon}"></i>
            ${message}
        `;

        // Insert after the form
        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);

        // Auto-hide after 5 seconds
        this.scheduleMessageRemoval(messageDiv);

        console.log(`📧 Contact form message: ${type} - ${message}`);
    }

    /**
     * Schedules message removal with fade out animation
     * @param {Element} messageElement - Message element to remove
     */
    scheduleMessageRemoval(messageElement) {
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Checks if running in development environment
     * @returns {boolean} True if development environment
     */
    isDevelopment() {
        if (window.EnvironmentUtils) {
            return window.EnvironmentUtils.isDevelopment();
        }
        // Fallback
        const devHosts = ['localhost', '127.0.0.1', ''];
        return devHosts.includes(window.location.hostname);
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