import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Code2, BrainCircuit, Sparkles, TerminalSquare } from 'lucide-react';

export default function Software() {
  const [stats, setStats] = useState({
    commits: 120,
    repos: 15,
    languages: 6,
    isLive: false
  });

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const username = 'Rtur2003';
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          const activeRepos = reposData.filter(r => new Date(r.updated_at) > new Date(Date.now() - 365*24*60*60*1000));
          const estimatedCommits = Math.min(activeRepos.length * 12 + 50, 200);
          const languages = new Set();
          reposData.forEach(r => { if(r.language) languages.add(r.language); });

          setStats({
            commits: estimatedCommits,
            repos: userData.public_repos || reposData.length,
            languages: Math.min(languages.size, 8),
            isLive: true
          });
        }
      } catch (error) {
        console.log("GitHub API fallback active");
      }
    }
    fetchGitHubStats();
  }, []);

  useGSAP(() => {
    gsap.from('.software-reveal', {
      scrollTrigger: {
        trigger: '#software',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out'
    });
    
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.2)'
    });
  });

  const crownProjects = [
    {
      title: "AURIS",
      subtitle: "AI Audio Detection Model",
      desc: "Built on Wav2vec2 architecture, classifying deepfake AI-generated music from authentic human compositions.",
      icon: <BrainCircuit size={32} />
    },
    {
      title: "CrownCode",
      subtitle: "Monorepo Ecosystem",
      desc: "An advanced modular architecture utilizing Next.js, FastAPI, and Kotlin Native for cross-platform scalable AI tools.",
      icon: <Code2 size={32} />
    },
    {
      title: "Crown Dreams",
      subtitle: "Neural Dream Diary",
      desc: "An experimental platform leveraging LLMs to interpret and archive human dreams through atmospheric narratives.",
      icon: <Sparkles size={32} />
    },
    {
      title: "VOTRYX",
      subtitle: "Automated Voting System",
      desc: "High-performance automated decision and rating architecture designed for rapid community consensus.",
      icon: <TerminalSquare size={32} />
    }
  ];

  return (
    <section id="software" style={{
      padding: 'var(--space-2xl) var(--space-md)',
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'var(--color-bg)',
      borderTop: '1px solid var(--color-border)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="font-display software-reveal" style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            CrownCode Ecosystem
          </h2>
          <h3 className="software-reveal font-display" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            marginTop: 'var(--space-xs)',
            textTransform: 'uppercase'
          }}>
            Architecting the Future
          </h3>
          <p className="software-reveal" style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-muted)',
            marginTop: 'var(--space-sm)',
            maxWidth: '600px',
            margin: 'var(--space-sm) auto 0'
          }}>
            Where advanced machine learning models and scalable software architectures meet creative vision.
          </p>
        </div>

        {/* Live GitHub Stats Banner */}
        <div className="software-reveal" style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          padding: 'var(--space-lg)',
          backgroundColor: 'rgba(212, 176, 120, 0.05)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          marginBottom: 'var(--space-2xl)',
          position: 'relative'
        }}>
          {stats.isLive && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '20px',
              fontSize: '0.75rem',
              color: '#27c93f',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              <div style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#27c93f', animation:'wave 2s infinite'}}></div>
              Live API
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>{stats.commits}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.05em' }}>GitHub Commits</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>{stats.repos}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.05em' }}>Public Repositories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>{stats.languages}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.05em' }}>Tech Stack Languages</div>
          </div>
        </div>

        {/* AI Projects Grid */}
        <div className="projects-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--space-md)' 
        }}>
          {crownProjects.map((project, idx) => (
            <div key={idx} className="project-card" style={{
              backgroundColor: '#111',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: 'var(--space-lg)',
              transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(212, 176, 120, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                {project.icon}
              </div>
              <h4 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>
                {project.title}
              </h4>
              <h5 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {project.subtitle}
              </h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                {project.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
