import React from 'react';

export default function ContactSection() {
  return (
    <section className="section" id="section-contact">
      <div className="section__header">
        <h2 className="section__title">Contact</h2>
        <p className="section__subtitle">Get in touch</p>
      </div>

      <div className="pixel-card" style={{ marginBottom: 16 }}>
        <div className="pixel-card__title">Send a Message</div>
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'var(--pixel-text-dim)',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Name
            </label>
            <input
              type="text"
              className="pixel-btn"
              style={{
                width: '100%',
                textAlign: 'left',
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: 'normal',
                outline: 'none',
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'var(--pixel-text-dim)',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Message
            </label>
            <textarea
              className="pixel-btn"
              style={{
                width: '100%',
                minHeight: 80,
                textAlign: 'left',
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: 'normal',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'Courier New, Courier, monospace',
              }}
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            className="pixel-btn pixel-btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Send &gt;
          </button>
        </form>
      </div>

      <div className="pixel-card">
        <div className="pixel-card__title">Links</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['GitHub', 'Twitter', 'Email'].map((link) => (
            <div
              key={link}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 13,
                padding: '4px 0',
              }}
            >
              <span style={{ color: 'var(--pixel-text-dim)' }}>{link}</span>
              <span style={{ color: 'var(--pixel-accent)' }}>{'->'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
