class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        this.musicCards = document.querySelectorAll('.music-card');
        this.trackTitle = document.querySelector('.track-title');
        this.trackArtist = document.querySelector('.track-artist');
        this.trackImage = document.querySelector('.track-image img');
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isDragging = false;
        this.tracks = this.loadTracks();
        
        this.initializePlayer();
        this.bindEvents();
        this.loadTrack(this.currentTrackIndex);
    }
    
    loadTracks() {
        const tracks = [];
        this.musicCards.forEach((card, index) => {
            const title = card.querySelector('h4').textContent;
            const genre = card.querySelector('p').textContent;
            const duration = card.querySelector('.card-duration').textContent;
            const image = card.querySelector('img').src;
            const audioSrc = card.dataset.src || `assets/music/sample-track-${index + 1}.mp3`;
            
            tracks.push({
                title,
                artist: 'Müzik Sanatçısı',
                genre,
                duration,
                image,
                src: audioSrc
            });
        });
        return tracks;
    }
    
    initializePlayer() {
        this.updateUI();
        this.createVisualizerBars();
    }
    
    bindEvents() {
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => this.seek(e));
            this.progressBar.addEventListener('mousedown', () => this.isDragging = true);
            document.addEventListener('mouseup', () => this.isDragging = false);
            this.progressBar.addEventListener('mousemove', (e) => {
                if (this.isDragging) this.seek(e);
            });
        }
        
        if (this.audio) {
            this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.nextTrack());
            this.audio.addEventListener('loadstart', () => this.showLoading());
            this.audio.addEventListener('loadeddata', () => this.hideLoading());
        }
        
        this.musicCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.play();
                this.updateActiveCard();
            });
        });
        
        const prevBtn = document.querySelector('.control-btn.prev');
        const nextBtn = document.querySelector('.control-btn.next');
        const shuffleBtn = document.querySelector('.control-btn.shuffle');
        const repeatBtn = document.querySelector('.control-btn.repeat');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
        if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        if (repeatBtn) repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    createVisualizerBars() {
        const visualizer = document.createElement('div');
        visualizer.className = 'music-visualizer';
        visualizer.innerHTML = `
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
        `;
        
        const trackInfo = document.querySelector('.track-info');
        if (trackInfo) {
            trackInfo.appendChild(visualizer);
        }
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        const track = this.tracks[index];
        
        if (this.audio) {
            this.audio.src = track.src;
        }
        
        if (this.trackTitle) this.trackTitle.textContent = track.title;
        if (this.trackArtist) this.trackArtist.textContent = track.artist;
        if (this.trackImage) this.trackImage.src = track.image;
        
        this.updateActiveCard();
        this.updateUI();
        
        this.createNotification(`Şu an çalıyor: ${track.title}`, 'info');
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.audio) {
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                    this.startVisualizer();
                }).catch(error => {
                    console.error('Çalma hatası:', error);
                    this.createNotification('Müzik çalınamadı. Lütfen tekrar deneyin.', 'error');
                });
            }
        }
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopVisualizer();
        }
    }
    
    updatePlayButton() {
        if (this.playPauseBtn) {
            const icon = this.playPauseBtn.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    }
    
    seek(e) {
        if (!this.audio || !this.progressBar) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const seekTime = percent * this.audio.duration;
        
        if (!isNaN(seekTime)) {
            this.audio.currentTime = seekTime;
        }
    }
    
    updateProgress() {
        if (!this.audio || this.isDragging) return;
        
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        
        if (this.progress) {
            this.progress.style.width = `${percent}%`;
        }
        
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        if (!this.audio) return;
        
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    prevTrack() {
        this.currentTrackIndex = this.currentTrackIndex === 0 ? 
            this.tracks.length - 1 : this.currentTrackIndex - 1;
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    toggleShuffle() {
        const shuffleBtn = document.querySelector('.control-btn.shuffle');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active');
            const isActive = shuffleBtn.classList.contains('active');
            this.createNotification(
                isActive ? 'Karışık çalma açık' : 'Karışık çalma kapalı', 
                'info'
            );
        }
    }
    
    toggleRepeat() {
        const repeatBtn = document.querySelector('.control-btn.repeat');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active');
            const isActive = repeatBtn.classList.contains('active');
            
            if (this.audio) {
                this.audio.loop = isActive;
            }
            
            this.createNotification(
                isActive ? 'Tekrar açık' : 'Tekrar kapalı', 
                'info'
            );
        }
    }
    
    updateActiveCard() {
        this.musicCards.forEach((card, index) => {
            if (index === this.currentTrackIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    startVisualizer() {
        const visualizerBars = document.querySelectorAll('.music-bar');
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }
    
    stopVisualizer() {
        const visualizerBars = document.querySelectorAll('.music-bar');
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
    
    showLoading() {
        const playBtn = this.playPauseBtn?.querySelector('i');
        if (playBtn) {
            playBtn.className = 'fas fa-spinner fa-spin';
        }
    }
    
    hideLoading() {
        this.updatePlayButton();
    }
    
    handleKeyPress(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextTrack();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevTrack();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.changeVolume(0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.changeVolume(-0.1);
                break;
        }
    }
    
    changeVolume(delta) {
        if (!this.audio) return;
        
        const newVolume = Math.max(0, Math.min(1, this.audio.volume + delta));
        this.audio.volume = newVolume;
        
        this.createNotification(`Ses seviyesi: ${Math.round(newVolume * 100)}%`, 'info');
    }
    
    updateUI() {
        this.updatePlayButton();
        this.updateProgress();
        this.updateDuration();
    }
    
    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `music-notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 15, 35, 0.95);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    getCurrentTime() {
        return this.audio ? this.audio.currentTime : 0;
    }
    
    getDuration() {
        return this.audio ? this.audio.duration : 0;
    }
    
    getCurrentTrack() {
        return this.tracks[this.currentTrackIndex];
    }
    
    getPlaylist() {
        return this.tracks;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.musicPlayer = new MusicPlayer();
    
    console.log('🎵 Müzik çalar başarıyla yüklendi!');
    
    const musicSection = document.getElementById('music');
    if (musicSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.music-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(musicSection);
        
        const cards = musicSection.querySelectorAll('.music-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden && window.musicPlayer && window.musicPlayer.isPlaying) {
        console.log('Sayfa arka plana alındı, müzik devam ediyor...');
    }
});