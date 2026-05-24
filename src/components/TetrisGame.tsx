'use client';

import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useTetris, computeDisplayBoard } from '@/hooks/useTetris';
import { BOARD_WIDTH, BOARD_HEIGHT, PIECE_COLORS, getShape } from '@/lib/tetris';

export default function TetrisGame() {
  const {
    board,
    currentPiece,
    nextPieceType,
    score,
    level,
    lines,
    gameState,
    ghost,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotate,
  } = useTetris();

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Compute display board from state
  const displayBoard = useMemo(
    () => computeDisplayBoard(board, currentPiece, ghost),
    [board, currentPiece, ghost]
  );

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (gameState === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          softDrop();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    },
    [gameState, startGame, togglePause, moveLeft, moveRight, softDrop, hardDrop, rotate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameState === 'playing' || gameState === 'paused') {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    }
  }, [gameState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    e.preventDefault();

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    touchStartRef.current = null;

    // Tap detection (for rotate or pause)
    if (absDx < 10 && absDy < 10) {
      if (gameState === 'playing') {
        rotate();
      } else if (gameState === 'paused') {
        togglePause();
      }
      return;
    }

    if (gameState !== 'playing') return;

    // Swipe detection
    if (absDx > absDy) {
      // Horizontal swipe
      if (dx > 20) {
        moveRight();
      } else if (dx < -20) {
        moveLeft();
      }
    } else {
      // Vertical swipe
      if (dy > 30) {
        // Swipe down - soft drop
        softDrop();
      } else if (dy < -30 && dt < 300) {
        // Quick swipe up - hard drop
        hardDrop();
      }
    }
  }, [gameState, moveLeft, moveRight, softDrop, hardDrop, rotate, togglePause]);

  const cellSize = Math.min(
    Math.floor(
      (typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.85, 300) : 250) / BOARD_WIDTH
    ),
    28
  );

  // Next piece preview
  const nextShape = nextPieceType ? getShape(nextPieceType, 0) : null;
  const nextColor = nextPieceType ? PIECE_COLORS[nextPieceType] : null;

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 select-none">
      {/* Status bar */}
      <div className="flex items-center justify-between w-full max-w-[320px] px-2">
        <div className="flex gap-3 text-[10px] sm:text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          <div>
            <span className="text-[#a7a9be]">LV</span>{' '}
            <span className="text-[#fffffe]">{level}</span>
          </div>
          <div>
            <span className="text-[#a7a9be]">SCORE</span>{' '}
            <span className="text-[#ffa500]">{score}</span>
          </div>
          <div>
            <span className="text-[#a7a9be]">LINES</span>{' '}
            <span className="text-[#00c853]">{lines}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Game board */}
        <div
          ref={containerRef}
          className="game-container pixel-border"
          style={{
            width: cellSize * BOARD_WIDTH,
            height: cellSize * BOARD_HEIGHT,
            backgroundColor: '#0a0e1a',
            position: 'relative',
            touchAction: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {displayBoard.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`cell ${cell.color ? 'filled' : ''} ${cell.ghost ? 'ghost' : ''}`}
                style={{
                  position: 'absolute',
                  top: y * cellSize,
                  left: x * cellSize,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell.color || 'transparent',
                  opacity: cell.ghost ? 0.25 : cell.color ? 1 : undefined,
                  border: cell.color
                    ? `2px solid rgba(0,0,0,0.3)`
                    : '1px solid rgba(255,255,255,0.03)',
                }}
              />
            ))
          )}

          {/* Game state overlays */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70" style={{ zIndex: 10 }}>
              <div className="text-center px-4">
                <div className="text-lg sm:text-2xl mb-3" style={{ fontFamily: "'Press Start 2P', monospace", color: '#ff6b6b' }}>
                  TETRIS
                </div>
                <button
                  className="pixel-border-button px-4 py-2 text-xs sm:text-sm bg-[#ff6b6b] text-[#0f0e17] cursor-pointer active:translate-y-0.5 hover:bg-[#ff5252]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  onClick={startGame}
                >
                  START
                </button>
                <div className="mt-4 text-[8px] sm:text-[10px] text-[#a7a9be]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  Keyboard: Arrow keys, Space<br />
                  Touch: Swipe & tap
                </div>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70" style={{ zIndex: 10 }}>
              <div className="text-center">
                <div className="text-xs sm:text-sm mb-3" style={{ fontFamily: "'Press Start 2P', monospace", color: '#ffd600' }}>
                  PAUSED
                </div>
                <button
                  className="pixel-border-button px-3 py-1.5 text-[10px] sm:text-xs bg-[#ffd600] text-[#0f0e17] cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  onClick={togglePause}
                >
                  RESUME
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75" style={{ zIndex: 10 }}>
              <div className="text-center px-4">
                <div className="text-xs sm:text-sm mb-1" style={{ fontFamily: "'Press Start 2P', monospace", color: '#ff1744' }}>
                  GAME OVER
                </div>
                <div className="text-[9px] sm:text-xs mb-3 text-[#fffffe]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  Score: {score}
                </div>
                <button
                  className="pixel-border-button px-3 py-1.5 text-[10px] sm:text-xs bg-[#ff6b6b] text-[#0f0e17] cursor-pointer"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  onClick={startGame}
                >
                  RESTART
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side panel: Next piece preview */}
        <div className="flex flex-col gap-3">
          <div className="pixel-border p-2 sm:p-3 bg-[#0a0e1a]">
            <div className="text-[8px] sm:text-[10px] mb-2 text-[#a7a9be]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              NEXT
            </div>
            <div
              style={{
                width: cellSize * 4,
                height: cellSize * 4,
                position: 'relative',
              }}
            >
              {nextShape &&
                nextShape.map((row, y) =>
                  row.map((cell, x) =>
                    cell ? (
                      <div
                        key={`next-${y}-${x}`}
                        className="cell filled"
                        style={{
                          position: 'absolute',
                          top: y * cellSize,
                          left: x * cellSize,
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: nextColor || undefined,
                        }}
                      />
                    ) : null
                  )
                )}
            </div>
          </div>

          {/* Touch controls for mobile */}
          <div className="flex flex-col gap-1 mt-1 sm:hidden">
            <div className="flex justify-center gap-1">
              <TouchButton label="⟲" onClick={rotate} />
            </div>
            <div className="flex justify-center gap-1">
              <TouchButton label="◀" onClick={moveLeft} />
              <TouchButton label="▼" onClick={softDrop} />
              <TouchButton label="▶" onClick={moveRight} />
            </div>
            <div className="flex justify-center gap-1">
              <TouchButton label="▼▼" onClick={hardDrop} highlight />
            </div>
          </div>

          {/* Desktop keyboard hint */}
          <div className="hidden sm:block text-[8px] text-[#a7a9be] max-w-[120px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            ← → move<br />
            ↑ rotate<br />
            ↓ soft drop<br />
            Space hard drop<br />
            P pause
          </div>
        </div>
      </div>
    </div>
  );
}

function TouchButton({
  label,
  onClick,
  highlight,
}: {
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      className="touch-btn pixel-border-button flex items-center justify-center cursor-pointer active:translate-y-0.5"
      style={{
        width: 56,
        height: 48,
        backgroundColor: highlight ? '#ff6b6b' : '#16213e',
        color: highlight ? '#0f0e17' : '#fffffe',
        fontSize: highlight ? '14px' : '18px',
        fontFamily: "'Press Start 2P', monospace",
        lineHeight: 1,
        touchAction: 'manipulation',
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {label}
    </button>
  );
}
