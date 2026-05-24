'use client';

import { useState } from 'react';
import TetrisGame from '@/components/TetrisGame';

type GameTab = 'tetris';

export default function Home() {
  const [activeGame, setActiveGame] = useState<GameTab>('tetris');

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0e17]">
      {/* Header / Navigation */}
      <header className="pixel-border bg-[#1a1a2e] px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-4 sm:gap-6 max-w-2xl mx-auto">
          <h1
            className="text-sm sm:text-base text-[#ff6b6b] tracking-wider"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            VIDE
          </h1>
          <div className="flex gap-2 sm:gap-4">
            <NavButton
              label="TETRIS"
              active={activeGame === 'tetris'}
              onClick={() => setActiveGame('tetris')}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[6px] sm:text-[8px] text-[#a7a9be]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              RETRO GAME
            </span>
          </div>
        </nav>
      </header>

      {/* Game content area */}
      <main className="flex-1 flex items-start justify-center py-4 sm:py-8 px-2">
        {activeGame === 'tetris' && <TetrisGame />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d3460] py-3 px-4 text-center">
        <p
          className="text-[8px] sm:text-[10px] text-[#a7a9be]"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          VIDE © 2026 • Pixel Perfect Gaming
        </p>
      </footer>
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="px-3 py-1.5 text-[9px] sm:text-[11px] cursor-pointer transition-all active:translate-y-0.5"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        backgroundColor: active ? '#ff6b6b' : 'transparent',
        color: active ? '#0f0e17' : '#a7a9be',
        border: '2px solid',
        borderColor: active ? '#ff6b6b' : '#2d3460',
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
