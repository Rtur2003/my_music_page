// ===============================================
// COMPREHENSIVE FORM VALIDATION & ACCESSIBILITY
// ===============================================

class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.errors = new Map();
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupAccessibility();
        this.testAllForms();
        console.log('📋 Form validator initialized for', this.forms.length, 'forms');
    }

    setupFormValidation() {
        this.forms.forEach(form => {
            // Real-time validation
            form.addEventListener('input', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    this.validateField(e.target);
                }
            });

            // Form submission validation
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });

            // Add required indicators
            this.addRequiredIndicators(form);
        });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }

        // Email validation
        else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // URL validation
        else if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        }

        // Password strength (for admin)
        else if (field.type === 'password' && field.value) {
            if (field.value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters';
            }
        }

        // Update field state
        if (isValid) {
            this.markFieldValid(field);
            this.errors.delete(fieldName);
        } else {
            this.markFieldInvalid(field, errorMessage);
            this.errors.set(fieldName, errorMessage);
        }

        return isValid;
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setupAccessibility() {
        this.forms.forEach(form => {
            // Add ARIA labels
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
                    const label = this.getFieldLabel(field);
                    if (label) {
                        field.setAttribute('aria-label', label);
                    }
                }

                // Add autocomplete attributes
                if (!field.getAttribute('autocomplete')) {
                    if (field.type === 'email') field.setAttribute('autocomplete', 'email');
                    if (field.name === 'name') field.setAttribute('autocomplete', 'name');
                    if (field.type === 'password') field.setAttribute('autocomplete', 'current-password');
                }

                // Add input mode for better mobile keyboards
                if (field.type === 'email') field.setAttribute('inputmode', 'email');
                if (field.type === 'url') field.setAttribute('inputmode', 'url');
            });

            // Add form role
            if (!form.getAttribute('role')) {
                form.setAttribute('role', 'form');
            }
        });
    }

    addRequiredIndicators(form) {
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const label = form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                indicator.style.color = '#d4b078';
                indicator.setAttribute('aria-hidden', 'true');
                label.appendChild(indicator);
            }
        });
    }

    markFieldValid(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.style.borderColor = '#4caf50';
        field.setAttribute('aria-invalid', 'false');
    }

    markFieldInvalid(field, errorMessage) {
        field.classList.remove('valid');
        field.classList.add('invalid');
        field.style.borderColor = '#f44336';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}-error`);

        this.showFieldError(field, errorMessage);
    }

    clearFieldError(field) {
        const existingError = document.getElementById(`${field.id}-error`);
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
        field.classList.remove('valid', 'invalid');
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.id = `${field.id}-error`;
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #f44336;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;

        // Add error icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorDiv.insertBefore(icon, errorDiv.firstChild);

        field.parentNode.appendChild(errorDiv);
    }

    showFormErrors(form) {
        const firstErrorField = form.querySelector('.invalid');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) return label.textContent.replace(' *', '').trim();
        
        return field.placeholder || field.name || field.id || 'Field';
    }

    testAllForms() {
        console.log('🧪 Testing all forms...');
        
        this.forms.forEach((form, index) => {
            const formName = form.id || form.name || `Form ${index + 1}`;
            const fields = form.querySelectorAll('input, textarea, select');
            
            console.log(`📋 ${formName}:`, {
                fields: fields.length,
                required: form.querySelectorAll('[required]').length,
                hasSubmitHandler: form.onsubmit !== null || form.dataset.hasValidator === 'true'
            });

            // Test each field
            fields.forEach(field => {
                const issues = [];
                
                if (!field.id) issues.push('Missing ID');
                if (!field.name) issues.push('Missing name attribute');
                if (field.required && !field.getAttribute('aria-label') && !document.querySelector(`label[for="${field.id}"]`)) {
                    issues.push('Missing label');
                }

                if (issues.length > 0) {
                    console.warn(`⚠️ Field ${field.type} issues:`, issues);
                }
            });
        });
    }

    // Public method to manually validate
    validateSpecificForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            return this.validateForm(form);
        }
        return false;
    }
}

// CSS for form validation
const validationStyles = `
.field-error {
    animation: errorSlideIn 0.3s ease-out;
}

@keyframes errorSlideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-field.valid input,
.form-field.valid textarea {
    border-color: #4caf50 !important;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-field.invalid input,
.form-field.invalid textarea {
    border-color: #f44336 !important;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.required-indicator {
    color: #d4b078 !important;
    font-weight: bold;
}

/* Focus states for accessibility */
input:focus,
textarea:focus,
select:focus,
button:focus {
    outline: 2px solid #d4b078;
    outline-offset: 2px;
}

/* Better mobile touch targets */
@media (max-width: 768px) {
    button,
    input,
    textarea,
    select {
        min-height: 44px;
        min-width: 44px;
    }
}
`;

// Inject validation styles
const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = validationStyles;
document.head.appendChild(validationStyleSheet);

// Initialize form validator when DOM is ready
let formValidator;
document.addEventListener('DOMContentLoaded', () => {
    formValidator = new FormValidator();
    window.formValidator = formValidator;
});

// Export for global access
window.FormValidator = FormValidator;