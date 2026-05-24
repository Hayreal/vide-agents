'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Board,
  Piece,
  PieceType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createEmptyBoard,
  createPiece,
  getShape,
  isValidPosition,
  lockPiece,
  clearLines,
  ghostPosition,
  SCORE_TABLE,
  getDropInterval,
  PIECE_COLORS,
} from '@/lib/tetris';

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

interface TetrisState {
  board: Board;
  currentPiece: Piece | null;
  nextPieceType: PieceType | null;
  score: number;
  level: number;
  lines: number;
  gameState: GameState;
  bag: PieceType[];
}

type TetrisAction =
  | { type: 'START_GAME'; firstPiece: Piece; nextType: PieceType; bag: PieceType[] }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN'; scored: boolean }
  | { type: 'ROTATE' }
  | { type: 'HARD_DROP'; dropDistance: number }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' };

function shuffleBag(): PieceType[] {
  const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}

function spawnFromBag(bag: PieceType[]): { piece: Piece; nextType: PieceType; newBag: PieceType[] } {
  let currentBag = bag.length === 0 ? shuffleBag() : [...bag];
  const type = currentBag[0];
  currentBag = currentBag.slice(1);
  if (currentBag.length === 0) {
    currentBag = shuffleBag();
  }
  const nextType = currentBag[0];
  return {
    piece: createPiece(type),
    nextType,
    newBag: currentBag,
  };
}

function tryMove(
  board: Board,
  piece: Piece,
  dx: number,
  dy: number
): Piece | null {
  const shape = getShape(piece.type, piece.rotation);
  const newPos = { x: piece.position.x + dx, y: piece.position.y + dy };
  if (isValidPosition(board, shape, newPos)) {
    return { ...piece, position: newPos };
  }
  return null;
}

function tryRotate(board: Board, piece: Piece): Piece | null {
  const newRotation = (piece.rotation + 1) % 4;
  const newShape = getShape(piece.type, newRotation);

  // Basic rotation
  if (isValidPosition(board, newShape, piece.position)) {
    return { ...piece, rotation: newRotation };
  }

  // Wall kicks
  const kicks = [-1, 1, -2, 2];
  for (const kick of kicks) {
    const kickPos = { x: piece.position.x + kick, y: piece.position.y };
    if (isValidPosition(board, newShape, kickPos)) {
      return { ...piece, rotation: newRotation, position: kickPos };
    }
  }
  // Try kick up for I piece
  if (piece.type === 'I') {
    const upPos = { x: piece.position.x, y: piece.position.y - 1 };
    if (isValidPosition(board, newShape, upPos)) {
      return { ...piece, rotation: newRotation, position: upPos };
    }
  }
  return null;
}

function lockAndSpawn(state: TetrisState): TetrisState {
  if (!state.currentPiece) return state;

  const lockedBoard = lockPiece(state.board, state.currentPiece);
  const { newBoard, linesCleared } = clearLines(lockedBoard);

  let { score, level, lines } = state;
  if (linesCleared > 0) {
    score += (SCORE_TABLE[linesCleared] || 0) * level;
    lines += linesCleared;
    level = Math.floor(lines / 10) + 1;
  }

  // Spawn next piece from bag
  const { piece, nextType, newBag } = spawnFromBag(state.bag);
  const shape = getShape(piece.type, piece.rotation);

  if (!isValidPosition(newBoard, shape, piece.position)) {
    return {
      ...state,
      board: newBoard,
      currentPiece: null,
      score,
      lines,
      level,
      gameState: 'gameover',
    };
  }

  return {
    ...state,
    board: newBoard,
    currentPiece: piece,
    nextPieceType: nextType,
    bag: newBag,
    score,
    lines,
    level,
  };
}

function tetrisReducer(state: TetrisState, action: TetrisAction): TetrisState {
  switch (action.type) {
    case 'START_GAME':
      return {
        board: createEmptyBoard(),
        currentPiece: action.firstPiece,
        nextPieceType: action.nextType,
        score: 0,
        level: 1,
        lines: 0,
        gameState: 'playing',
        bag: action.bag,
      };

    case 'MOVE_LEFT': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const moved = tryMove(state.board, state.currentPiece, -1, 0);
      if (!moved) return state;
      return { ...state, currentPiece: moved };
    }

    case 'MOVE_RIGHT': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const moved = tryMove(state.board, state.currentPiece, 1, 0);
      if (!moved) return state;
      return { ...state, currentPiece: moved };
    }

    case 'MOVE_DOWN': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const moved = tryMove(state.board, state.currentPiece, 0, 1);
      if (!moved) {
        // Lock and spawn
        return lockAndSpawn(state);
      }
      return {
        ...state,
        currentPiece: moved,
        score: action.scored ? state.score + 1 : state.score,
      };
    }

    case 'ROTATE': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const rotated = tryRotate(state.board, state.currentPiece);
      if (!rotated) return state;
      return { ...state, currentPiece: rotated };
    }

    case 'HARD_DROP': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const shape = getShape(state.currentPiece.type, state.currentPiece.rotation);
      let y = state.currentPiece.position.y;
      while (isValidPosition(state.board, shape, { x: state.currentPiece.position.x, y: y + 1 })) {
        y++;
      }
      const dropDistance = y - state.currentPiece.position.y;
      const droppedPiece = {
        ...state.currentPiece,
        position: { x: state.currentPiece.position.x, y },
      };
      const tempState = {
        ...state,
        currentPiece: droppedPiece,
        score: state.score + dropDistance * 2,
      };
      return lockAndSpawn(tempState);
    }

    case 'TICK': {
      if (!state.currentPiece || state.gameState !== 'playing') return state;
      const moved = tryMove(state.board, state.currentPiece, 0, 1);
      if (!moved) {
        return lockAndSpawn(state);
      }
      return { ...state, currentPiece: moved };
    }

    case 'PAUSE':
      return state.gameState === 'playing'
        ? { ...state, gameState: 'paused' }
        : state;

    case 'RESUME':
      return state.gameState === 'paused'
        ? { ...state, gameState: 'playing' }
        : state;

    case 'GAME_OVER':
      return { ...state, gameState: 'gameover' };

    default:
      return state;
  }
}

const initialState: TetrisState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieceType: null,
  score: 0,
  level: 1,
  lines: 0,
  gameState: 'idle',
  bag: [],
};

export function useTetris() {
  const [state, dispatch] = useReducer(tetrisReducer, initialState);
  const gameStateRef = useRef(state.gameState);
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelRef = useRef(state.level);

  useEffect(() => {
    gameStateRef.current = state.gameState;
  }, [state.gameState]);

  useEffect(() => {
    levelRef.current = state.level;
  }, [state.level]);

  // Auto-drop loop
  useEffect(() => {
    if (state.gameState !== 'playing') {
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      return;
    }

    const interval = getDropInterval(state.level);

    const loop = () => {
      if (gameStateRef.current !== 'playing') return;
      dispatch({ type: 'TICK' });
      dropTimerRef.current = setTimeout(loop, getDropInterval(levelRef.current));
    };

    dropTimerRef.current = setTimeout(loop, interval);

    return () => {
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
    };
  }, [state.gameState, state.level]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    const newBag = shuffleBag();
    const type = newBag[0];
    const nextType = newBag[1];
    const remainingBag = newBag.slice(2).length === 0 ? shuffleBag() : newBag.slice(2);
    dispatch({
      type: 'START_GAME',
      firstPiece: createPiece(type),
      nextType,
      bag: remainingBag,
    });
  }, []);

  const togglePause = useCallback(() => {
    if (state.gameState === 'playing') dispatch({ type: 'PAUSE' });
    else if (state.gameState === 'paused') dispatch({ type: 'RESUME' });
  }, [state.gameState]);

  const moveLeft = useCallback(() => dispatch({ type: 'MOVE_LEFT' }), []);
  const moveRight = useCallback(() => dispatch({ type: 'MOVE_RIGHT' }), []);

  const softDrop = useCallback(() => {
    dispatch({ type: 'MOVE_DOWN', scored: true });
  }, []);

  const hardDrop = useCallback(() => {
    dispatch({ type: 'HARD_DROP', dropDistance: 0 });
  }, []);

  const rotate = useCallback(() => dispatch({ type: 'ROTATE' }), []);

  // Compute ghost position
  const ghost =
    state.currentPiece && state.gameState === 'playing'
      ? ghostPosition(state.board, state.currentPiece)
      : null;

  return {
    board: state.board,
    currentPiece: state.currentPiece,
    nextPieceType: state.nextPieceType,
    score: state.score,
    level: state.level,
    lines: state.lines,
    gameState: state.gameState,
    ghost,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotate,
  };
}

// Helper to compute display board with current piece and ghost
export function computeDisplayBoard(
  board: Board,
  currentPiece: Piece | null,
  ghost: { x: number; y: number } | null
): { color: string | null; ghost: boolean }[][] {
  const display = board.map(row =>
    row.map(cell => ({ color: cell ? PIECE_COLORS[cell as PieceType] : null, ghost: false }))
  );

  if (currentPiece) {
    const shape = getShape(currentPiece.type, currentPiece.rotation);

    // Draw ghost
    if (ghost) {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const y = ghost.y + row;
            const x = ghost.x + col;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              display[y][x] = { color: PIECE_COLORS[currentPiece.type], ghost: true };
            }
          }
        }
      }
    }

    // Draw current piece (overwrites ghost cells)
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const y = currentPiece.position.y + row;
          const x = currentPiece.position.x + col;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            display[y][x] = { color: PIECE_COLORS[currentPiece.type], ghost: false };
          }
        }
      }
    }
  }

  return display;
}
