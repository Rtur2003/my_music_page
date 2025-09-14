/* ===============================================
   GITHUB REAL TIME STATS
   =============================================== */

class GitHubStats {
    constructor() {
        this.username = 'Rtur2003';
        this.statsLoaded = false;
    }

    async fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}`);
            const repoResponse = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`);

            if (response.ok && repoResponse.ok) {
                const userData = await response.json();
                const repoData = await repoResponse.json();

                return {
                    repos: userData.public_repos || 15,
                    followers: userData.followers || 5,
                    commits: this.calculateCommits(repoData),
                    languages: this.getLanguages(repoData)
                };
            } else {
                // Fallback değerler
                return {
                    repos: 15,
                    followers: 5,
                    commits: 120,
                    languages: 6
                };
            }
        } catch (error) {
            console.log('GitHub API fetch failed, using fallback values');
            return {
                repos: 15,
                followers: 5,
                commits: 120,
                languages: 6
            };
        }
    }

    calculateCommits(repoData) {
        // Basit bir tahmin - aktif repo sayısı * ortalama commit
        const activeRepos = repoData.filter(repo =>
            new Date(repo.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        );
        return Math.min(activeRepos.length * 15, 200); // Max 200 commit göster
    }

    getLanguages(repoData) {
        const languages = new Set();
        repoData.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        return Math.min(languages.size, 8); // Max 8 dil göster
    }

    async updateStats() {
        if (this.statsLoaded) return;

        const stats = await this.fetchGitHubStats();

        // Stats elementi bul ve güncelle
        const statItems = document.querySelectorAll('.software-stats .stat-item');

        if (statItems.length >= 4) {
            // GitHub Commits
            const commitsEl = statItems[0]?.querySelector('.stat-number');
            if (commitsEl) {
                commitsEl.setAttribute('data-count', stats.commits);
                this.animateCounter(commitsEl, stats.commits);
            }

            // Public Repositories
            const reposEl = statItems[1]?.querySelector('.stat-number');
            if (reposEl) {
                reposEl.setAttribute('data-count', stats.repos);
                this.animateCounter(reposEl, stats.repos);
            }

            // Programming Languages
            const langsEl = statItems[2]?.querySelector('.stat-number');
            if (langsEl) {
                langsEl.setAttribute('data-count', stats.languages);
                this.animateCounter(langsEl, stats.languages);
            }

            // GitHub Followers (yeni)
            const followersEl = statItems[3]?.querySelector('.stat-number');
            if (followersEl) {
                followersEl.setAttribute('data-count', stats.followers);
                this.animateCounter(followersEl, stats.followers);

                // Label'ı da güncelle
                const followersLabel = statItems[3]?.querySelector('.stat-label');
                if (followersLabel) {
                    followersLabel.textContent = 'GitHub Followers';
                }
            }
        }

        this.statsLoaded = true;
    }

    animateCounter(element, targetValue) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// Initialize GitHub stats when page loads
document.addEventListener('DOMContentLoaded', () => {
    const githubStats = new GitHubStats();

    // Update stats when software section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                githubStats.updateStats();
            }
        });
    }, { threshold: 0.5 });

    const softwareSection = document.getElementById('software');
    if (softwareSection) {
        observer.observe(softwareSection);
    }
});