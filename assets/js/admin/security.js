// Admin Security System
// Provides secure access to admin panel with multiple protection layers

class AdminSecurity {
    constructor() {
        this.accessCodes = new Set([
            'hasan2024',
            'musicadmin',
            'portfolio_secure',
            'arthur_admin_access'
        ]);
        
        this.attempts = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 30 * 60 * 1000; // 30 minutes
        this.sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
        
        this.init();
    }
    
    init() {
        this.checkLockout();
        this.setupSecretKeyListener();
        this.setupAccessFormIfExists();
    }
    
    // Check if admin is locked out
    checkLockout() {
        const lockoutEnd = SafeStorage.getItem('admin_lockout');
        if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
            const remaining = Math.ceil((parseInt(lockoutEnd) - Date.now()) / 60000);
            return { locked: true, remaining };
        }
        
        if (lockoutEnd && Date.now() >= parseInt(lockoutEnd)) {
            SafeStorage.removeItem('admin_lockout');
            SafeStorage.removeItem('admin_attempts');
            this.attempts = 0;
        }
        
        return { locked: false };
    }
    
    // Secret key combination to access admin (Konami code style)
    setupSecretKeyListener() {
        const secretSequence = ['KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'];
        let currentSequence = [];
        let sequenceTimer = null;
        
        document.addEventListener('keydown', (e) => {
            // Only listen for keys when no input is focused
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            currentSequence.push(e.code);
            
            // Reset sequence after 2 seconds of inactivity
            clearTimeout(sequenceTimer);
            sequenceTimer = setTimeout(() => {
                currentSequence = [];
            }, 2000);
            
            // Keep only last 5 keys
            if (currentSequence.length > secretSequence.length) {
                currentSequence = currentSequence.slice(-secretSequence.length);
            }
            
            // Check if sequence matches
            if (currentSequence.length === secretSequence.length) {
                const matches = currentSequence.every((key, index) => 
                    key === secretSequence[index]
                );
                
                if (matches) {
                    this.showAccessPrompt();
                    currentSequence = [];
                }
            }
        });
    }
    
    // Show admin access prompt
    showAccessPrompt() {
        const lockoutStatus = this.checkLockout();
        
        if (lockoutStatus.locked) {
            this.showNotification(
                `Admin access locked. Try again in ${lockoutStatus.remaining} minutes.`, 
                'error'
            );
            return;
        }
        
        const modal = this.createAccessModal();
        document.body.appendChild(modal);
        
        // Focus on input
        const input = modal.querySelector('#adminAccessCode');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
    
    createAccessModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-access-modal';
        modal.id = 'adminAccessModal';
        
        modal.innerHTML = `
            <div class="admin-access-overlay">
                <div class="admin-access-dialog">
                    <div class="admin-access-header">
                        <h3><i class="fas fa-lock"></i> Admin Access</h3>
                        <button class="admin-close-btn" onclick="this.closest('.admin-access-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="admin-access-body">
                        <p>Enter admin access code:</p>
                        <input type="password" id="adminAccessCode" placeholder="Access code" autocomplete="off">
                        <div class="admin-attempts">
                            Attempts remaining: <span id="attemptsRemaining">${this.maxAttempts - this.attempts}</span>
                        </div>
                    </div>
                    <div class="admin-access-footer">
                        <button class="btn-cancel" onclick="this.closest('.admin-access-modal').remove()">Cancel</button>
                        <button class="btn-submit" onclick="adminSecurity.validateAccess()">Access</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const input = modal.querySelector('#adminAccessCode');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.validateAccess();
            }
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
        
        return modal;
    }
    
    validateAccess() {
        const modal = document.getElementById('adminAccessModal');
        const input = document.getElementById('adminAccessCode');
        const code = input.value.trim();
        
        if (!code) {
            this.showFieldError(input, 'Please enter access code');
            return;
        }
        
        if (this.accessCodes.has(code)) {
            // Success
            this.grantAccess();
            modal.remove();
        } else {
            // Failed attempt
            this.handleFailedAttempt();
            input.value = '';
            input.focus();
        }
    }
    
    handleFailedAttempt() {
        this.attempts++;
        SafeStorage.setItem('admin_attempts', this.attempts.toString());
        
        const remaining = this.maxAttempts - this.attempts;
        const attemptsSpan = document.getElementById('attemptsRemaining');
        
        if (attemptsSpan) {
            attemptsSpan.textContent = remaining;
        }
        
        if (remaining <= 0) {
            // Lockout
            const lockoutEnd = Date.now() + this.lockoutTime;
            SafeStorage.setItem('admin_lockout', lockoutEnd.toString());
            
            const modal = document.getElementById('adminAccessModal');
            modal.remove();
            
            this.showNotification('Too many failed attempts. Admin access locked for 30 minutes.', 'error');
        } else {
            const input = document.getElementById('adminAccessCode');
            this.showFieldError(input, `Invalid code. ${remaining} attempts remaining.`);
        }
    }
    
    grantAccess() {
        // Create admin session
        const sessionToken = this.generateSessionToken();
        const sessionExpiry = Date.now() + this.sessionDuration;
        
        SafeStorage.setItem('admin_session', sessionToken);
        SafeStorage.setItem('admin_session_expiry', sessionExpiry.toString());
        SafeStorage.removeItem('admin_attempts');
        SafeStorage.removeItem('admin_lockout');
        
        this.showNotification('Access granted. Redirecting to admin panel...', 'success');
        
        // Redirect to admin panel after short delay
        setTimeout(() => {
            // Use obfuscated filename
            window.location.href = 'admin.html?token=' + encodeURIComponent(sessionToken);
        }, 1500);
    }
    
    generateSessionToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token + '_' + Date.now();
    }
    
    // Validate admin session (for admin.html page)
    validateSession() {
        const session = SafeStorage.getItem('admin_session');
        const expiry = SafeStorage.getItem('admin_session_expiry');
        
        if (!session || !expiry) {
            return false;
        }
        
        if (Date.now() > parseInt(expiry)) {
            this.clearSession();
            return false;
        }
        
        // Validate token in URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        if (urlToken && urlToken !== session) {
            return false;
        }
        
        return true;
    }
    
    clearSession() {
        SafeStorage.removeItem('admin_session');
        SafeStorage.removeItem('admin_session_expiry');
    }
    
    // Auto-logout after session expiry
    setupSessionMonitor() {
        if (!this.validateSession()) {
            this.redirectToMain();
            return;
        }
        
        const checkSession = () => {
            if (!this.validateSession()) {
                this.showNotification('Session expired. Redirecting...', 'warning');
                setTimeout(() => this.redirectToMain(), 2000);
                return;
            }
            
            // Check again in 1 minute
            setTimeout(checkSession, 60000);
        };
        
        setTimeout(checkSession, 60000);
    }
    
    redirectToMain() {
        this.clearSession();
        window.location.href = 'index.html';
    }
    
    // Utility methods
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Remove error styling after 3 seconds
        setTimeout(() => {
            field.classList.remove('error');
            errorDiv.remove();
        }, 3000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, type === 'error' ? 5000 : 3000);
    }
    
    setupAccessFormIfExists() {
        const accessForm = document.getElementById('adminAccessForm');
        if (accessForm) {
            accessForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateAccess();
            });
        }
    }
}

// Initialize admin security
const adminSecurity = new AdminSecurity();

// Make available globally
if (typeof window !== 'undefined') {
    window.adminSecurity = adminSecurity;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminSecurity;
}