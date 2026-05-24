import React from 'react';

const projects = [
  {
    title: 'Project Alpha',
    status: 'Completed',
    statusColor: 'var(--pixel-success)',
    description: 'A retro-styled platformer game built with canvas.',
  },
  {
    title: 'Project Beta',
    status: 'In Progress',
    statusColor: 'var(--pixel-warning)',
    description: 'Pixel art editor with real-time collaboration.',
  },
  {
    title: 'Project Gamma',
    status: 'Planned',
    statusColor: 'var(--pixel-text-dim)',
    description: 'Multiplayer dungeon crawler with procedural generation.',
  },
];

export default function ProjectsSection() {
  return (
    <section className="section" id="section-projects">
      <div className="section__header">
        <h2 className="section__title">Projects</h2>
        <p className="section__subtitle">What we have built</p>
      </div>

      {projects.map((project) => (
        <div
          key={project.title}
          className="pixel-card"
          style={{ marginBottom: 12 }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div className="pixel-card__title" style={{ margin: 0, border: 'none', padding: 0 }}>
              {project.title}
            </div>
            <span
              style={{
                fontSize: 11,
                color: project.statusColor,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              [{project.status}]
            </span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--pixel-text-dim)' }}>
            {project.description}
          </p>
        </div>
      ))}
    </section>
  );
}
