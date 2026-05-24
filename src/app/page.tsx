'use client';

import React, { useState, useCallback, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import HomeSection from '@/components/HomeSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';

type SectionId = 'home' | 'about' | 'projects' | 'contact';

const sectionIds: SectionId[] = ['home', 'about', 'projects', 'contact'];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const handleNavigate = useCallback((sectionId: string) => {
    const target = sectionId as SectionId;
    setActiveSection(target);

    // Update URL hash without scroll
    history.pushState(null, '', `#${target}`);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as SectionId;
    if (hash && sectionIds.includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            display: activeSection === 'home' ? 'block' : 'none',
          }}
        >
          <HomeSection />
        </div>
        <div
          style={{
            display: activeSection === 'about' ? 'block' : 'none',
          }}
        >
          <AboutSection />
        </div>
        <div
          style={{
            display: activeSection === 'projects' ? 'block' : 'none',
          }}
        >
          <ProjectsSection />
        </div>
        <div
          style={{
            display: activeSection === 'contact' ? 'block' : 'none',
          }}
        >
          <ContactSection />
        </div>
      </div>

      <BottomNav activeSection={activeSection} onNavigate={handleNavigate} />
    </main>
  );
}
