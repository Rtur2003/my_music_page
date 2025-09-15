/* ===============================================
   MODERN MUSIC PRODUCER WEBSITE FEATURES
   Deadmau5, Skrillex, Martin Garrix tarzı özellikler
   =============================================== */

document.addEventListener('DOMContentLoaded', function() {
    initModernFeatures();
    addNewsletterSignup();
    addShowsSection();
    addMerchandiseSection();
    addSocialMediaIntegration();
    addSupportIntegration();
    initAudioVisualizer();
    addLatestReleasesCarousel();
    console.log('🎵 Modern features initialized');
});

/* ===============================================
   NEWSLETTER SIGNUP (Deadmau5 tarzı)
   =============================================== */
function addNewsletterSignup() {
    const newsletterSection = document.createElement('section');
    newsletterSection.className = 'newsletter-section';
    newsletterSection.innerHTML = `
        <div class="container">
            <div class="newsletter-content">
                <h2 class="newsletter-title">
                    <i class="fas fa-envelope"></i>
                    Stay Updated
                </h2>
                <p class="newsletter-description">
                    Get notified about new releases, exclusive content, and upcoming shows.
                </p>
                <form class="newsletter-form" id="newsletterForm">
                    <div class="newsletter-input-group">
                        <input
                            type="email"
                            id="newsletterEmail"
                            placeholder="Enter your email address"
                            required
                        >
                        <button type="submit" class="newsletter-btn">
                            <i class="fas fa-paper-plane"></i>
                            Subscribe
                        </button>
                    </div>
                    <p class="newsletter-privacy">
                        We respect your privacy. No spam, ever.
                    </p>
                </form>
            </div>
        </div>
    `;

    // Insert before footer
    const footer = document.querySelector('.sonic-footer');
    if (footer) {
        footer.parentNode.insertBefore(newsletterSection, footer);
    }

    // Newsletter form handler - wait for DOM insertion
    setTimeout(() => {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('newsletterEmail').value;

                // Show success message
                showNotification('success', `Thanks for subscribing with ${email}! 🎵`);
                this.reset();
            });
        }
    }, 100);
}

/* ===============================================
   UPCOMING SHOWS SECTION
   =============================================== */
function addShowsSection() {
    const showsHTML = `
        <section class="shows-section" id="shows">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-calendar-alt"></i>
                        Live Shows
                    </h2>
                    <p class="section-subtitle">Coming soon - stay tuned for live performance dates</p>
                </div>
                <div class="shows-grid coming-soon-message">
                    <div class="coming-soon-card">
                        <div class="coming-soon-icon">
                            <i class="fas fa-calendar-plus"></i>
                        </div>
                        <h3>Shows Coming Soon</h3>
                        <p>I'm currently working on some exciting live performance opportunities. Follow me on social media to be the first to know about upcoming shows!</p>
                        <div class="coming-soon-actions">
                            <a href="https://www.instagram.com/rthur_hsn" target="_blank" class="notify-btn">
                                <i class="fab fa-instagram"></i>
                                Get Notified
                            </a>
                        </div>
                    </div>
                </div>
                <div class="shows-grid hidden">
                    <div class="show-card">
                        <div class="show-date">
                            <div class="show-month">MAR</div>
                            <div class="show-day">15</div>
                        </div>
                        <div class="show-info">
                            <h3 class="show-title">Electronic Music Festival</h3>
                            <p class="show-venue">
                                <i class="fas fa-map-marker-alt"></i>
                                İstanbul, Turkey
                            </p>
                            <p class="show-time">
                                <i class="fas fa-clock"></i>
                                21:00 - 02:00
                            </p>
                        </div>
                        <div class="show-actions">
                            <a href="#" class="show-btn primary">Get Tickets</a>
                            <a href="#" class="show-btn secondary">More Info</a>
                        </div>
                    </div>

                    <div class="show-card">
                        <div class="show-date">
                            <div class="show-month">APR</div>
                            <div class="show-day">22</div>
                        </div>
                        <div class="show-info">
                            <h3 class="show-title">Spring Music Conference</h3>
                            <p class="show-venue">
                                <i class="fas fa-map-marker-alt"></i>
                                Ankara, Turkey
                            </p>
                            <p class="show-time">
                                <i class="fas fa-clock"></i>
                                19:00 - 23:00
                            </p>
                        </div>
                        <div class="show-actions">
                            <a href="#" class="show-btn primary">Get Tickets</a>
                            <a href="#" class="show-btn secondary">More Info</a>
                        </div>
                    </div>

                    <div class="show-card">
                        <div class="show-date">
                            <div class="show-month">MAY</div>
                            <div class="show-day">10</div>
                        </div>
                        <div class="show-info">
                            <h3 class="show-title">Summer Kickoff Party</h3>
                            <p class="show-venue">
                                <i class="fas fa-map-marker-alt"></i>
                                Izmir, Turkey
                            </p>
                            <p class="show-time">
                                <i class="fas fa-clock"></i>
                                22:00 - 04:00
                            </p>
                        </div>
                        <div class="show-actions">
                            <a href="#" class="show-btn primary">Get Tickets</a>
                            <a href="#" class="show-btn secondary">More Info</a>
                        </div>
                    </div>
                </div>
                <div class="shows-footer">
                    <a href="#" class="shows-all-btn">
                        <i class="fas fa-external-link-alt"></i>
                        View All Shows
                    </a>
                </div>
            </div>
        </section>
    `;

    // Insert after music section
    const musicSection = document.getElementById('music');
    if (musicSection) {
        musicSection.insertAdjacentHTML('afterend', showsHTML);
    }
}

/* ===============================================
   MERCHANDISE SECTION
   =============================================== */
function addMerchandiseSection() {
    const merchHTML = `
        <section class="merch-section" id="merchandise">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-tshirt"></i>
                        Merchandise
                    </h2>
                    <p class="section-subtitle">Official merch store coming soon</p>
                </div>
                <div class="merch-grid coming-soon-message">
                    <div class="coming-soon-card">
                        <div class="coming-soon-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3>Merch Store Coming Soon</h3>
                        <p>I'm working on creating some awesome merchandise for my fans. Stay tuned for official hoodies, t-shirts, and more!</p>
                        <div class="coming-soon-actions">
                            <a href="https://www.instagram.com/rthur_hsn" target="_blank" class="notify-btn">
                                <i class="fab fa-instagram"></i>
                                Get Notified
                            </a>
                        </div>
                    </div>
                </div>
                <div class="merch-grid hidden">
                    <div class="merch-card">
                        <div class="merch-image">
                            <img src="assets/images/logo-main.png" alt="Logo Hoodie" loading="lazy">
                            <div class="merch-overlay">
                                <button class="merch-quick-view">Quick View</button>
                            </div>
                        </div>
                        <div class="merch-info">
                            <h3 class="merch-title">Logo Hoodie</h3>
                            <p class="merch-price">$65.00</p>
                            <div class="merch-colors">
                                <span class="color-dot" style="background: #000"></span>
                                <span class="color-dot" style="background: #333"></span>
                                <span class="color-dot" style="background: #d4b078"></span>
                            </div>
                        </div>
                    </div>

                    <div class="merch-card">
                        <div class="merch-image">
                            <img src="assets/images/logo-main.png" alt="Artist T-Shirt" loading="lazy">
                            <div class="merch-overlay">
                                <button class="merch-quick-view">Quick View</button>
                            </div>
                        </div>
                        <div class="merch-info">
                            <h3 class="merch-title">Artist T-Shirt</h3>
                            <p class="merch-price">$35.00</p>
                            <div class="merch-colors">
                                <span class="color-dot" style="background: #000"></span>
                                <span class="color-dot" style="background: #fff; border: 1px solid #ccc"></span>
                            </div>
                        </div>
                    </div>

                    <div class="merch-card">
                        <div class="merch-image">
                            <img src="assets/images/logo-main.png" alt="Logo Cap" loading="lazy">
                            <div class="merch-overlay">
                                <button class="merch-quick-view">Quick View</button>
                            </div>
                        </div>
                        <div class="merch-info">
                            <h3 class="merch-title">Logo Cap</h3>
                            <p class="merch-price">$25.00</p>
                            <div class="merch-colors">
                                <span class="color-dot" style="background: #000"></span>
                                <span class="color-dot" style="background: #d4b078"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="merch-footer">
                    <a href="#" class="merch-shop-btn">
                        <i class="fas fa-shopping-bag"></i>
                        Visit Shop
                    </a>
                </div>
            </div>
        </section>
    `;

    // Insert before contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.insertAdjacentHTML('beforebegin', merchHTML);
    }
}

/* ===============================================
   ENHANCED SOCIAL MEDIA INTEGRATION
   =============================================== */
function addSocialMediaIntegration() {
    const socialFeedHTML = `
        <section class="social-feed-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-hashtag"></i>
                        Latest Updates
                    </h2>
                    <p class="section-subtitle">Follow me across platforms</p>
                </div>
                <div class="social-feed-grid">
                    <div class="social-post instagram">
                        <div class="social-header">
                            <i class="fab fa-instagram"></i>
                            <span>Instagram</span>
                        </div>
                        <div class="social-content">
                            <p>Working on some new beats in the studio 🎵✨ #NewMusic #StudioLife</p>
                            <div class="social-stats">
                                <span><i class="fas fa-heart"></i> 1.2K</span>
                                <span><i class="fas fa-comment"></i> 45</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-post twitter">
                        <div class="social-header">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </div>
                        <div class="social-content">
                            <p>New track dropping this Friday! Who's ready? 🚀 #ComingSoon</p>
                            <div class="social-stats">
                                <span><i class="fas fa-retweet"></i> 89</span>
                                <span><i class="fas fa-heart"></i> 234</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-post youtube">
                        <div class="social-header">
                            <i class="fab fa-youtube"></i>
                            <span>YouTube</span>
                        </div>
                        <div class="social-content">
                            <p>Behind the scenes of my latest composition process 🎹</p>
                            <div class="social-stats">
                                <span><i class="fas fa-eye"></i> 5.6K</span>
                                <span><i class="fas fa-thumbs-up"></i> 178</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Insert before newsletter
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
        newsletterSection.insertAdjacentHTML('beforebegin', socialFeedHTML);
    }
}

/* ===============================================
   SUPPORT INTEGRATION (IYZICO)
   =============================================== */
function addSupportIntegration() {
    const supportBanner = document.createElement('div');
    supportBanner.className = 'support-banner';
    supportBanner.innerHTML = `
        <div class="support-content">
            <div class="support-icon">
                <i class="fas fa-heart"></i>
            </div>
            <div class="support-text">
                <h3>Çalışmalarımı Destekle</h3>
                <p>Müzik üretimimde ve yazılım projelerimde bana destek olmak istersen</p>
            </div>
            <a href="https://iyzi.link/AJspVg" target="_blank" rel="noopener" class="support-btn">
                <i class="fas fa-coffee"></i>
                Destek Ol
            </a>
        </div>
        <button class="support-close" onclick="this.parentElement.style.display='none'">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add support banner to page
    document.body.appendChild(supportBanner);

    // Show banner after 5 seconds
    setTimeout(() => {
        supportBanner.style.display = 'flex';
    }, 5000);
}

/* ===============================================
   AUDIO VISUALIZER
   =============================================== */
function initAudioVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'audio-visualizer';
    visualizer.innerHTML = `
        <canvas id="visualizerCanvas"></canvas>
        <div class="visualizer-controls">
            <button id="visualizerToggle" class="visualizer-btn">
                <i class="fas fa-wave-square"></i>
                Toggle Visualizer
            </button>
        </div>
    `;

    // Add to player section
    const playerCard = document.querySelector('.modern-player-card');
    if (playerCard) {
        playerCard.appendChild(visualizer);
    }

    // Simple visualizer animation
    const canvas = document.getElementById('visualizerCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 60;

        let animationId;
        function drawVisualizer() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barCount = 20;
            const barWidth = canvas.width / barCount;

            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.random() * canvas.height;
                const x = i * barWidth;
                const y = canvas.height - barHeight;

                ctx.fillStyle = `hsl(${45 + i * 2}, 70%, 60%)`;
                ctx.fillRect(x, y, barWidth - 2, barHeight);
            }

            animationId = requestAnimationFrame(drawVisualizer);
        }

        // Enhanced visualizer toggle with audio support
        document.getElementById('visualizerToggle').addEventListener('click', async function() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.innerHTML = '<i class="fas fa-wave-square"></i> Start Visualizer';
                this.classList.remove('active');
            } else {
                try {
                    // Use simulated visualizer instead of microphone access
                    console.log('🎵 Starting simulated visualizer');
                    const dataArray = new Uint8Array(32); // Simulated frequency data

                    function drawRealtimeVisualizer() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // Generate simulated frequency data
                        for (let i = 0; i < dataArray.length; i++) {
                            dataArray[i] = Math.random() * 255;
                        }

                        const barCount = dataArray.length;
                        const barWidth = canvas.width / barCount;

                        for (let i = 0; i < barCount; i++) {
                            const barHeight = (dataArray[i] / 255) * canvas.height;
                            const x = i * barWidth;
                            const y = canvas.height - barHeight;

                            ctx.fillStyle = `hsl(${45 + i * 3}, 70%, ${50 + (dataArray[i] / 255) * 30}%)`;
                            ctx.fillRect(x, y, barWidth - 2, barHeight);
                        }

                        animationId = requestAnimationFrame(drawRealtimeVisualizer);
                    }

                    drawRealtimeVisualizer();
                    this.innerHTML = '<i class="fas fa-stop"></i> Stop Visualizer';
                    this.classList.add('active');

                } catch (error) {
                    // Fallback to demo mode
                    drawVisualizer();
                    this.innerHTML = '<i class="fas fa-stop"></i> Stop Visualizer (Demo)';
                    this.classList.add('active');
                }
            }
        });
    }
}

/* ===============================================
   LATEST RELEASES CAROUSEL
   =============================================== */
function addLatestReleasesCarousel() {
    const carouselHTML = `
        <section class="releases-carousel-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="fas fa-compact-disc"></i>
                        Latest Releases
                    </h2>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev" id="releasesPrev">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-btn next" id="releasesNext">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="releases-carousel" id="releasesCarousel">
                    <div class="release-slide active">
                        <img src="assets/images/logo-main.png" alt="Latest Release" loading="lazy">
                        <div class="release-info">
                            <h3>LIAR</h3>
                            <p>Single • 2024</p>
                        </div>
                    </div>
                    <div class="release-slide">
                        <img src="assets/images/logo-main.png" alt="Interstellar Remix" loading="lazy">
                        <div class="release-info">
                            <h3>Interstellar But My Version</h3>
                            <p>Remix • 2024</p>
                        </div>
                    </div>
                    <div class="release-slide">
                        <img src="assets/images/logo-main.png" alt="Oppenheimer Remix" loading="lazy">
                        <div class="release-info">
                            <h3>Oppenheimer But My Version</h3>
                            <p>Remix • 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Insert after hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.insertAdjacentHTML('afterend', carouselHTML);
    }

    // Carousel functionality - with null checks
    let currentSlide = 0;
    const slides = document.querySelectorAll('.release-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (!slides || slides.length === 0) return;
        if (index < 0 || index >= slides.length) return;

        slides.forEach(slide => {
            if (slide && slide.classList) {
                slide.classList.remove('active');
            }
        });

        if (slides[index] && slides[index].classList) {
            slides[index].classList.add('active');
        }
    }

    // Carousel controls - check if elements exist
    const nextBtn = document.getElementById('releasesNext');
    const prevBtn = document.getElementById('releasesPrev');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        });
    }

    // Auto-advance carousel - only if slides exist
    if (totalSlides > 0) {
        setInterval(() => {
            if (slides && slides.length > 0) {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            }
        }, 5000);
    }
}

/* ===============================================
   UTILITY FUNCTIONS
   =============================================== */
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function initModernFeatures() {
    console.log('🎵 Initializing modern music producer features...');

    // Add modern animations
    document.body.classList.add('modern-features-loaded');

    // Enhanced scroll effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}