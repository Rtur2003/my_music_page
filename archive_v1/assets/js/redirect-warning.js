/**
 * Redirect Warning System
 * Shows warning when clicking external links
 */

class RedirectWarning {
    constructor() {
        this.init();
    }

    init() {
        this.addRedirectWarnings();
        console.log('🔗 Redirect warning system initialized');
    }

    addRedirectWarnings() {
        // Find all external links
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="localhost"]):not([href*="hasanarthuraltuntas.com"])');

        externalLinks.forEach(link => {
            // Skip if already has warning
            if (link.dataset.warningAdded) {return;}

            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWarning(link.href, link);
            });

            link.dataset.warningAdded = 'true';
        });
    }

    showWarning(url) {
        // Create warning modal
        const modal = document.createElement('div');
        modal.className = 'redirect-warning-modal';
        modal.innerHTML = `
            <div class="redirect-warning-backdrop">
                <div class="redirect-warning-content">
                    <div class="warning-icon">⚠️</div>
                    <h3>Harici Bağlantı Uyarısı</h3>
                    <p>Bu bağlantı sizi harici bir web sitesine yönlendirecek:</p>
                    <div class="warning-url">${url}</div>
                    <p class="warning-note">Bu bağlantının güvenli olduğundan emin misiniz?</p>
                    <div class="warning-buttons">
                        <button class="btn-continue" data-url="${url}">Devam Et</button>
                        <button class="btn-cancel">İptal</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .redirect-warning-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .redirect-warning-backdrop {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .redirect-warning-content {
                background: var(--card-bg, #1a1a1a);
                border: 1px solid var(--accent-color, #d4b078);
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 100%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .warning-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }

            .redirect-warning-content h3 {
                color: var(--accent-color, #d4b078);
                margin-bottom: 15px;
                font-size: 1.5rem;
            }

            .redirect-warning-content p {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 15px;
                line-height: 1.6;
            }

            .warning-url {
                background: rgba(212, 176, 120, 0.1);
                border: 1px solid rgba(212, 176, 120, 0.3);
                border-radius: 8px;
                padding: 10px;
                margin: 15px 0;
                word-break: break-all;
                color: var(--accent-color, #d4b078);
                font-family: monospace;
                font-size: 0.9rem;
            }

            .warning-note {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.7);
            }

            .warning-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 25px;
            }

            .warning-buttons button {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 100px;
            }

            .btn-continue {
                background: var(--accent-color, #d4b078);
                color: var(--primary-bg, #0a0a0a);
            }

            .btn-continue:hover {
                background: #f4d03f;
                transform: translateY(-2px);
            }

            .btn-cancel {
                background: transparent;
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-cancel:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            @media (max-width: 768px) {
                .redirect-warning-content {
                    padding: 20px;
                    margin: 10px;
                }

                .warning-buttons {
                    flex-direction: column;
                }

                .warning-buttons button {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Handle button clicks
        modal.querySelector('.btn-continue').addEventListener('click', () => {
            window.open(url, '_blank', 'noopener,noreferrer');
            this.closeWarning(modal, style);
        });

        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            this.closeWarning(modal, style);
        });

        // Close on backdrop click
        modal.querySelector('.redirect-warning-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeWarning(modal, style);
            }
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeWarning(modal, style);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    closeWarning(modal, style) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {modal.parentNode.removeChild(modal);}
            if (style.parentNode) {style.parentNode.removeChild(style);}
        }, 300);

        // Add fadeOut animation
        if (!document.querySelector('#fadeOutAnimation')) {
            const fadeOutStyle = document.createElement('style');
            fadeOutStyle.id = 'fadeOutAnimation';
            fadeOutStyle.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.9); }
                }
            `;
            document.head.appendChild(fadeOutStyle);
        }
    }

    // Re-scan for new links
    rescan() {
        this.addRedirectWarnings();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.redirectWarning = new RedirectWarning();
});

// Re-scan when new content is loaded
document.addEventListener('musicDataLoaded', () => {
    if (window.redirectWarning) {
        setTimeout(() => {
            window.redirectWarning.rescan();
        }, 500);
    }
});

// Export for use in other scripts
window.RedirectWarning = RedirectWarning;