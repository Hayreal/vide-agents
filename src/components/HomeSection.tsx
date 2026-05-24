import React from 'react';

export default function HomeSection() {
  return (
    <section className="section section--active" id="section-home">
      <div className="section__header">
        <h1 className="section__title">Vide Agents</h1>
        <p className="section__subtitle">Pixel Art Portfolio</p>
      </div>

      <div className="pixel-card" style={{ marginBottom: 16 }}>
        <div className="pixel-card__title">Welcome</div>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--pixel-text)' }}>
          Welcome to my pixel-art corner. This is a single-page application
          built with a retro gaming aesthetic.
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="pixel-btn pixel-btn--primary">Explore</button>
          <button className="pixel-btn">Learn More</button>
        </div>
      </div>

      <div className="pixel-card">
        <div className="pixel-card__title">Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--pixel-text-dim)' }}>HP</span>
            <span style={{ color: 'var(--pixel-success)' }}>████████░░ 80%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--pixel-text-dim)' }}>EXP</span>
            <span style={{ color: 'var(--pixel-accent)' }}>██████░░░░ 60%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--pixel-text-dim)' }}>LEVEL</span>
            <span style={{ color: 'var(--pixel-primary)' }}>12</span>
          </div>
        </div>
      </div>
    </section>
  );
}
