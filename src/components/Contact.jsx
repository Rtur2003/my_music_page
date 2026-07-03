import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Github, Linkedin, Youtube, Instagram, Twitter, Coffee, Mail, Globe } from 'lucide-react';

export default function Contact() {
  useGSAP(() => {
    gsap.from('.contact-reveal', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out'
    });
  });

  const socials = [
    { name: 'Spotify', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.081 10.2c-3.959-2.34-10.44-2.52-14.22-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.32-1.32 11.52-1.08 16.08 1.62.54.3.72 1.02.42 1.56-.24.54-.9.72-1.68.36z"/></svg>, url: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef' },
    { name: 'YouTube', icon: <Youtube size={24} />, url: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA' },
    { name: 'Instagram', icon: <Instagram size={24} />, url: 'https://www.instagram.com/rthur_hsn' },
    { name: 'X', icon: <Twitter size={24} />, url: 'https://x.com/Rthur__1' },
    { name: 'LinkedIn', icon: <Linkedin size={24} />, url: 'https://tr.linkedin.com/in/hasan-arthur-altuntas' },
    { name: 'GitHub', icon: <Github size={24} />, url: 'https://github.com/Rtur2003' }
  ];

  return (
    <section id="contact" style={{
      padding: 'var(--space-2xl) var(--space-md) var(--space-lg)',
      position: 'relative',
      zIndex: 10,
      backgroundColor: '#000',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div className="footer-grid" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2xl)'
      }}>
        
        {/* Left Column: Let's Collaborate */}
        <div>
          <h2 className="font-display contact-reveal" style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-md)'
          }}>
            Let's Collaborate
          </h2>
          <h3 className="font-display contact-reveal" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 'var(--space-lg)'
          }}>
            Create<br/>The Next<br/>Masterpiece.
          </h3>
          <p className="contact-reveal" style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-muted)',
            maxWidth: '500px',
            marginBottom: 'var(--space-xl)'
          }}>
            Whether you need a cinematic score for your next film or a modern technical solution, I'm here to bring your vision to life.
          </p>

          <div className="contact-reveal" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <a href="mailto:contact@hasanarthuraltuntas.xyz" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '30px',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'none'
            }} data-cursor-text="Email">
              <Mail size={20} />
              Say Hello
            </a>
            
            <a href="https://iyzi.link/AJspVg" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'none'
            }} data-cursor-text="Support">
              <Coffee size={20} />
              Support My Art
            </a>
          </div>
        </div>

        {/* Right Column: Socials & Links */}
        <div className="contact-reveal" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            {socials.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  cursor: 'none'
                }}
                data-cursor-text="Visit"
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {social.icon}
                <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{social.name}</span>
              </a>
            ))}
            
            <a 
              href="https://hasanarthuraltuntas.xyz"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                cursor: 'none'
              }}
              data-cursor-text="Visit"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              <Globe size={24} />
              <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="contact-reveal" style={{
        marginTop: 'var(--space-2xl)',
        paddingTop: 'var(--space-lg)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Hasan Arthur Altuntaş. All rights reserved.
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Crafted with passion in Sakarya, TR
        </div>
      </div>
    </section>
  );
}
