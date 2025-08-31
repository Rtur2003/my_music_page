// Legacy Code Cleanup
// HTML'deki inline script'leri temizlemek için

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧹 Legacy cleanup running...');
    
    // Global fonksiyonlar için fallback
    if (typeof window.openMusicPlayer === 'undefined') {
        window.openMusicPlayer = function(index) {
            if (window.contentManager && window.contentManager.playTrack) {
                window.contentManager.playTrack(index);
            } else {
                console.log('🎵 Music player not ready yet');
            }
        };
    }
    
    if (typeof window.playTrack === 'undefined') {
        window.playTrack = window.openMusicPlayer;
    }
    
    // Platform switch fonksiyonu için fallback
    if (typeof window.switchPlatform === 'undefined') {
        window.switchPlatform = function(platformName, tabElement) {
            console.log('🔄 Platform switch:', platformName);
            
            // Tab güncellemesi
            const tabs = document.querySelectorAll('.platform-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            if (tabElement) tabElement.classList.add('active');
            
            // İçerik güncellemesi
            const contents = document.querySelectorAll('.platform-content');
            contents.forEach(content => content.classList.remove('active'));
            
            const targetContent = document.querySelector(`.platform-content[data-platform="${platformName}"]`);
            if (targetContent) targetContent.classList.add('active');
        };
    }
    
    // Modal kapatma fonksiyonu
    if (typeof window.closeMultiPlatformPlayer === 'undefined') {
        window.closeMultiPlatformPlayer = function() {
            const player = document.getElementById('multiPlatformPlayer');
            if (player) {
                player.classList.remove('show');
                setTimeout(() => {
                    if (player.parentNode) {
                        player.parentNode.removeChild(player);
                    }
                    document.body.style.overflow = '';
                }, 300);
            }
        };
    }
    
    // ESC tuşu ile modal kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeMultiPlatformPlayer();
        }
    });
    
    console.log('✅ Legacy cleanup completed');
});