import { useState, useEffect } from 'react';

export default function NavBar({ items }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Find active section
      const sections = items.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 var(--space-6)',
        zIndex: 100,
        transition: 'all var(--transition-base)',
        backgroundColor: scrolled ? 'rgba(250, 250, 250, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        {items.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                position: 'relative',
                padding: 'var(--space-2) 0',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.color = 'var(--color-text)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.color = 'var(--color-text-secondary)';
              }}
            >
              {label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: '1px',
                  }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
