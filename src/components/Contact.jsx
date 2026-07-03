import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Coffee, Mail, Globe } from 'lucide-react';
import { FaSpotify, FaYoutube, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

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
    { name: 'Spotify', icon: <FaSpotify size={24} />, url: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef' },
    { name: 'YouTube', icon: <FaYoutube size={24} />, url: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA' },
    { name: 'Instagram', icon: <FaInstagram size={24} />, url: 'https://www.instagram.com/rthur_hsn' },
    { name: 'X', icon: <FaTwitter size={24} />, url: 'https://x.com/Rthur__1' },
    { name: 'LinkedIn', icon: <FaLinkedin size={24} />, url: 'https://tr.linkedin.com/in/hasan-arthur-altuntas' },
    { name: 'GitHub', icon: <FaGithub size={24} />, url: 'https://github.com/Rtur2003' }
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
