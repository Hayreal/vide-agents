// Pure Tetris game logic

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  shape: number[][];
  position: Position;
  rotation: number;
}

export type Board = (string | null)[][];

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Piece shapes - each rotation state
const SHAPES: Record<PieceType, number[][][]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ],
};

export const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function randomPiece(): PieceType {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}

export function createPiece(type: PieceType): Piece {
  return {
    type,
    shape: SHAPES[type][0],
    position: { x: Math.floor((BOARD_WIDTH - SHAPES[type][0][0].length) / 2), y: 0 },
    rotation: 0,
  };
}

export function getShape(type: PieceType, rotation: number): number[][] {
  return SHAPES[type][rotation % SHAPES[type].length];
}

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function isValidPosition(
  board: Board,
  shape: number[][],
  pos: Position
): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = pos.x + col;
        const boardY = pos.y + row;
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

export function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  const shape = getShape(piece.type, piece.rotation);
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardY = piece.position.y + row;
        const boardX = piece.position.x + col;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }
  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }
  return { newBoard, linesCleared };
}

export function ghostPosition(
  board: Board,
  piece: Piece
): Position {
  const shape = getShape(piece.type, piece.rotation);
  let ghostY = piece.position.y;
  while (isValidPosition(board, shape, { x: piece.position.x, y: ghostY + 1 })) {
    ghostY++;
  }
  return { x: piece.position.x, y: ghostY };
}

export const SCORE_TABLE = [0, 100, 300, 500, 800];

export function getDropInterval(level: number): number {
  return Math.max(50, 800 - (level - 1) * 80);
}
