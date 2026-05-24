import React from 'react';

export default function AboutSection() {
  return (
    <section className="section" id="section-about">
      <div className="section__header">
        <h2 className="section__title">About</h2>
        <p className="section__subtitle">Who we are</p>
      </div>

      <div className="pixel-card" style={{ marginBottom: 16 }}>
        <div className="pixel-card__title">Biography</div>
        <p style={{ fontSize: 14, lineHeight: 1.8 }}>
          A passionate developer creating pixel-perfect experiences for the
          modern web. Combining retro aesthetics with cutting-edge technology.
        </p>
      </div>

      <div className="pixel-card">
        <div className="pixel-card__title">Skills</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'React / Next.js', level: 90 },
            { name: 'TypeScript', level: 85 },
            { name: 'CSS / Design', level: 80 },
            { name: 'Node.js', level: 75 },
          ].map((skill) => (
            <div key={skill.name}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                <span>{skill.name}</span>
                <span style={{ color: 'var(--pixel-text-dim)' }}>{skill.level}%</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'var(--pixel-bg)',
                  border: '1px solid var(--pixel-border)',
                }}
              >
                <div
                  style={{
                    width: `${skill.level}%`,
                    height: '100%',
                    background: 'var(--pixel-accent)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
