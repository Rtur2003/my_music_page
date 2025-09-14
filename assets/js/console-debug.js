/* ===============================================
   CONSOLE DEBUG & ERROR TRACKING SYSTEM
   Bu dosya tüm hataları yakalar ve gösterir
   =============================================== */

// Console açma butonu ekle
function addConsoleButton() {
    const consoleBtn = document.createElement('button');
    consoleBtn.innerHTML = `
        <i class="fas fa-bug"></i>
        <span>Debug</span>
    `;
    consoleBtn.className = 'debug-console-btn';
    consoleBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(10px);
    `;

    consoleBtn.addEventListener('mouseenter', () => {
        consoleBtn.style.transform = 'scale(1.05)';
        consoleBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.6)';
    });

    consoleBtn.addEventListener('mouseleave', () => {
        consoleBtn.style.transform = 'scale(1)';
        consoleBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.4)';
    });

    consoleBtn.addEventListener('click', () => {
        showDebugPanel();
    });

    document.body.appendChild(consoleBtn);
}

// Debug panel göster
function showDebugPanel() {
    const existingPanel = document.getElementById('debug-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.innerHTML = `
        <div class="debug-header">
            <h3><i class="fas fa-bug"></i> Debug Panel</h3>
            <button class="debug-close" onclick="this.closest('#debug-panel').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="debug-content">
            <div class="debug-section">
                <h4>🚨 Console Açma Yöntemleri:</h4>
                <ul>
                    <li><strong>F12</strong> - Developer Tools</li>
                    <li><strong>Ctrl + Shift + I</strong> - Inspector</li>
                    <li><strong>Ctrl + Shift + J</strong> - Console</li>
                    <li><strong>Ctrl + U</strong> - View Source</li>
                </ul>
            </div>
            <div class="debug-section">
                <h4>📊 Sayfa Durumu:</h4>
                <div id="debug-status"></div>
            </div>
            <div class="debug-section">
                <h4>🎵 Müzik Player Status:</h4>
                <div id="player-status"></div>
            </div>
            <div class="debug-section">
                <h4>❌ Hatalar:</h4>
                <div id="error-log"></div>
            </div>
            <div class="debug-section">
                <h4>⚡ Performance:</h4>
                <div id="performance-info"></div>
            </div>
            <div class="debug-actions">
                <button onclick="runDiagnostics()">🔍 Tanı Çalıştır</button>
                <button onclick="clearErrors()">🧹 Hataları Temizle</button>
                <button onclick="testAllFeatures()">🧪 Özellikleri Test Et</button>
            </div>
        </div>
    `;

    debugPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 2px solid var(--accent-gold);
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10002;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
        animation: debugSlideIn 0.3s ease;
    `;

    document.body.appendChild(debugPanel);
    updateDebugInfo();
}

// Debug info güncelle
function updateDebugInfo() {
    const statusDiv = document.getElementById('debug-status');
    const playerDiv = document.getElementById('player-status');
    const errorDiv = document.getElementById('error-log');
    const perfDiv = document.getElementById('performance-info');

    if (!statusDiv) return;

    // Sayfa durumu
    statusDiv.innerHTML = `
        <div class="status-item">
            <span class="status-label">DOM Loaded:</span>
            <span class="status-value ${document.readyState === 'complete' ? 'success' : 'warning'}">
                ${document.readyState}
            </span>
        </div>
        <div class="status-item">
            <span class="status-label">Font Awesome:</span>
            <span class="status-value ${window.FontAwesome ? 'success' : 'error'}">
                ${window.FontAwesome ? 'Loaded' : 'Not Loaded'}
            </span>
        </div>
        <div class="status-item">
            <span class="status-label">Music Loader:</span>
            <span class="status-value ${window.musicLoader ? 'success' : 'error'}">
                ${window.musicLoader ? 'Active' : 'Not Found'}
            </span>
        </div>
        <div class="status-item">
            <span class="status-label">YouTube Player:</span>
            <span class="status-value ${window.youtubePlayer ? 'success' : 'error'}">
                ${window.youtubePlayer ? 'Active' : 'Not Found'}
            </span>
        </div>
    `;

    // Player durumu
    if (window.youtubePlayer) {
        const status = window.youtubePlayer.getStatus();
        playerDiv.innerHTML = `
            <div class="status-item">
                <span class="status-label">Player Ready:</span>
                <span class="status-value ${status.isReady ? 'success' : 'error'}">
                    ${status.isReady ? 'Yes' : 'No'}
                </span>
            </div>
            <div class="status-item">
                <span class="status-label">Currently Playing:</span>
                <span class="status-value ${status.isPlaying ? 'success' : 'warning'}">
                    ${status.currentTrack || 'Nothing'}
                </span>
            </div>
            <div class="status-item">
                <span class="status-label">Tracks Loaded:</span>
                <span class="status-value">${status.tracksLoaded}</span>
            </div>
        `;
    } else {
        playerDiv.innerHTML = '<span class="status-value error">Player not initialized</span>';
    }

    // Hatalar
    errorDiv.innerHTML = window.debugErrors && window.debugErrors.length > 0
        ? window.debugErrors.slice(-5).map(error =>
            `<div class="error-item">
                <strong>${error.type}:</strong> ${error.message}
                <small>${error.time}</small>
            </div>`
        ).join('')
        : '<span class="status-value success">No errors detected</span>';

    // Performance
    if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        perfDiv.innerHTML = `
            <div class="status-item">
                <span class="status-label">Page Load Time:</span>
                <span class="status-value">${loadTime}ms</span>
            </div>
            <div class="status-item">
                <span class="status-label">Memory Usage:</span>
                <span class="status-value">${performance.memory ?
                    Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB'
                    : 'Not Available'}</span>
            </div>
        `;
    }
}

// Error tracking
window.debugErrors = [];

// Global error handler
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error:', e.error);
    window.debugErrors.push({
        type: 'JavaScript Error',
        message: e.message,
        file: e.filename,
        line: e.lineno,
        time: new Date().toLocaleTimeString()
    });

    if (window.debugErrors.length > 50) {
        window.debugErrors = window.debugErrors.slice(-25);
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    window.debugErrors.push({
        type: 'Promise Rejection',
        message: e.reason?.message || e.reason,
        time: new Date().toLocaleTimeString()
    });
});

// Debug functions
function runDiagnostics() {
    console.group('🔍 RUNNING DIAGNOSTICS');

    // Test Font Awesome
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-heart';
    document.body.appendChild(testIcon);
    const iconContent = window.getComputedStyle(testIcon, '::before').content;
    console.log('Font Awesome Test:', iconContent !== 'none' ? '✅ Working' : '❌ Failed');
    document.body.removeChild(testIcon);

    // Test Music Loader
    console.log('Music Loader:', window.musicLoader ? '✅ Available' : '❌ Missing');
    if (window.musicLoader && window.musicLoader.musicData) {
        console.log('Music Data:', window.musicLoader.musicData);
    }

    // Test YouTube Player
    console.log('YouTube Player:', window.youtubePlayer ? '✅ Available' : '❌ Missing');
    if (window.youtubePlayer) {
        console.log('Player Status:', window.youtubePlayer.getStatus());
    }

    // Test CSS Variables
    const root = document.documentElement;
    const primaryBg = getComputedStyle(root).getPropertyValue('--primary-bg');
    console.log('CSS Variables:', primaryBg ? '✅ Working' : '❌ Failed');

    console.groupEnd();
    updateDebugInfo();
}

function clearErrors() {
    window.debugErrors = [];
    console.clear();
    updateDebugInfo();
    console.log('🧹 Errors cleared');
}

function testAllFeatures() {
    console.group('🧪 TESTING ALL FEATURES');

    // Test play button
    const playBtn = document.querySelector('.main-play-button');
    console.log('Play Button:', playBtn ? '✅ Found' : '❌ Missing');

    // Test music cards
    const musicCards = document.querySelectorAll('.music-card');
    console.log('Music Cards:', musicCards.length > 0 ? `✅ Found ${musicCards.length}` : '❌ Missing');

    // Test platform links
    const platformLinks = document.querySelectorAll('.platform-link');
    console.log('Platform Links:', platformLinks.length > 0 ? `✅ Found ${platformLinks.length}` : '❌ Missing');

    // Test theme system
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('Theme System:', currentTheme ? `✅ Current: ${currentTheme}` : '❌ Not Set');

    console.groupEnd();
}

// CSS for debug panel
const debugStyles = `
@keyframes debugSlideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

.debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.debug-header h3 {
    color: var(--accent-gold);
    margin: 0;
    font-size: 1.2rem;
}

.debug-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.debug-close:hover {
    background: var(--tertiary-bg);
    color: var(--accent-gold);
}

.debug-content {
    padding: 1rem 1.5rem;
}

.debug-section {
    margin-bottom: 1.5rem;
}

.debug-section h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.debug-section ul {
    margin: 0;
    padding-left: 1.5rem;
    color: var(--text-secondary);
}

.debug-section ul li {
    margin-bottom: 0.25rem;
}

.status-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-label {
    color: var(--text-secondary);
    font-weight: 500;
}

.status-value {
    font-weight: 600;
}

.status-value.success {
    color: #4caf50;
}

.status-value.warning {
    color: #ff9800;
}

.status-value.error {
    color: #f44336;
}

.error-item {
    background: rgba(244, 67, 54, 0.1);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.error-item small {
    display: block;
    color: var(--text-muted);
    margin-top: 0.25rem;
}

.debug-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.debug-actions button {
    background: var(--accent-gold);
    color: var(--primary-bg);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.debug-actions button:hover {
    background: var(--accent-gold-light);
    transform: translateY(-1px);
}
`;

// Inject debug styles
const debugStyleSheet = document.createElement('style');
debugStyleSheet.textContent = debugStyles;
document.head.appendChild(debugStyleSheet);

// Initialize debug system
document.addEventListener('DOMContentLoaded', () => {
    addConsoleButton();
    console.log('🐛 Debug system initialized');
    console.log('📱 Console açma yöntemleri: F12, Ctrl+Shift+I, Ctrl+Shift+J');
});

// Export debug functions to global scope
window.runDiagnostics = runDiagnostics;
window.clearErrors = clearErrors;
window.testAllFeatures = testAllFeatures;