import { Component, EventEmitter, Output, OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';

interface Tetromino {
  shape: number[][];
  color: string;
}

const TETROMINOES: Tetromino[] = [
  { shape: [[1, 1, 1, 1]], color: '#00f0f0' },           // I
  { shape: [[1, 1], [1, 1]], color: '#f0f000' },         // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },   // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },   // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },   // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },   // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }    // L
];

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './tetris.html',
  styleUrl: './tetris.css'
})
export class Tetris implements OnInit, OnDestroy {
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public langService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  isMaximized = false;

  readonly rows = 20;
  readonly cols = 10;

  board: (string | null)[][] = [];
  nextGrid: (string | null)[][] = [];

  currentPiece!: Tetromino;
  nextPiece!: Tetromino;
  pieceRow = 0;
  pieceCol = 0;

  score = 0;
  lines = 0;
  level = 1;
  isPaused = false;
  gameOver = false;
  hasStarted = false;

  private gameLoop: any;

  ngOnInit(): void {
    this.initEmptyBoard();
    this.initEmptyNextGrid();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  private initEmptyBoard(): void {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
  }

  private initEmptyNextGrid(): void {
    this.nextGrid = Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  startGame(): void {
    this.stopLoop();
    this.initEmptyBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.isPaused = false;
    this.gameOver = false;
    this.hasStarted = true;

    this.nextPiece = this.randomPiece();
    this.spawnPiece();
    this.startLoop();
    this.cdr.detectChanges();
  }

  togglePause(): void {
    if (!this.hasStarted || this.gameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.stopLoop();
    } else {
      this.startLoop();
    }
    this.cdr.detectChanges();
  }

  private randomPiece(): Tetromino {
    const template = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    return {
      shape: template.shape.map(row => [...row]),
      color: template.color
    };
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.randomPiece();
    this.updateNextPreview();

    this.pieceRow = 0;
    this.pieceCol = Math.floor((this.cols - this.currentPiece.shape[0].length) / 2);

    if (this.hasCollision(this.pieceRow, this.pieceCol, this.currentPiece.shape)) {
      this.gameOver = true;
      this.stopLoop();
    }
  }

  private updateNextPreview(): void {
    this.initEmptyNextGrid();
    const shape = this.nextPiece.shape;
    const offsetR = Math.floor((4 - shape.length) / 2);
    const offsetC = Math.floor((4 - shape[0].length) / 2);

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          this.nextGrid[r + offsetR][c + offsetC] = this.nextPiece.color;
        }
      }
    }
  }

  private startLoop(): void {
    this.stopLoop();
    const speed = Math.max(100, 750 - (this.level - 1) * 65);
    this.gameLoop = setInterval(() => {
      this.tick();
      this.cdr.detectChanges(); // Fuerza a Angular a dibujar la caída automática
    }, speed);
  }

  private stopLoop(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }

  tick(): void {
    if (this.isPaused || this.gameOver || !this.hasStarted) return;

    if (!this.hasCollision(this.pieceRow + 1, this.pieceCol, this.currentPiece.shape)) {
      this.pieceRow++;
    } else {
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
    }
  }

  moveLeft(): void {
    if (this.canControl() && !this.hasCollision(this.pieceRow, this.pieceCol - 1, this.currentPiece.shape)) {
      this.pieceCol--;
    }
  }

  moveRight(): void {
    if (this.canControl() && !this.hasCollision(this.pieceRow, this.pieceCol + 1, this.currentPiece.shape)) {
      this.pieceCol++;
    }
  }

  softDrop(): void {
    if (!this.canControl()) return;
    if (!this.hasCollision(this.pieceRow + 1, this.pieceCol, this.currentPiece.shape)) {
      this.pieceRow++;
      this.score += 1;
    }
  }

  hardDrop(): void {
    if (!this.canControl()) return;
    while (!this.hasCollision(this.pieceRow + 1, this.pieceCol, this.currentPiece.shape)) {
      this.pieceRow++;
      this.score += 2;
    }
    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
  }

  rotate(): void {
    if (!this.canControl()) return;
    const rotated = this.currentPiece.shape[0].map((_, idx) =>
      this.currentPiece.shape.map(row => row[idx]).reverse()
    );

    if (!this.hasCollision(this.pieceRow, this.pieceCol, rotated)) {
      this.currentPiece.shape = rotated;
    } else if (!this.hasCollision(this.pieceRow, this.pieceCol - 1, rotated)) {
      this.pieceCol--;
      this.currentPiece.shape = rotated;
    } else if (!this.hasCollision(this.pieceRow, this.pieceCol + 1, rotated)) {
      this.pieceCol++;
      this.currentPiece.shape = rotated;
    }
  }

  private canControl(): boolean {
    return this.hasStarted && !this.isPaused && !this.gameOver;
  }

  private hasCollision(targetRow: number, targetCol: number, shape: number[][]): boolean {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;

        const newR = targetRow + r;
        const newC = targetCol + c;

        if (newC < 0 || newC >= this.cols || newR >= this.rows) return true;
        if (newR >= 0 && this.board[newR][newC] !== null) return true;
      }
    }
    return false;
  }

  private lockPiece(): void {
    const shape = this.currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const boardR = this.pieceRow + r;
          const boardC = this.pieceCol + c;
          if (boardR >= 0 && boardR < this.rows && boardC >= 0 && boardC < this.cols) {
            this.board[boardR][boardC] = this.currentPiece.color;
          }
        }
      }
    }
  }

  private clearLines(): void {
    let linesCleared = 0;

    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.board[r].every(cell => cell !== null)) {
        this.board.splice(r, 1);
        this.board.unshift(Array(this.cols).fill(null));
        linesCleared++;
        r++;
      }
    }

    if (linesCleared > 0) {
      const pointsMap = [0, 100, 300, 500, 800];
      this.score += (pointsMap[linesCleared] || 800) * this.level;
      this.lines += linesCleared;

      const newLevel = Math.floor(this.lines / 10) + 1;
      if (newLevel !== this.level) {
        this.level = newLevel;
        this.startLoop();
      }
    }
  }

  // Calcula la fila exacta donde va a aterrizar la ficha (Ghost Piece)
  getGhostRow(): number {
    let ghostR = this.pieceRow;
    while (!this.hasCollision(ghostR + 1, this.pieceCol, this.currentPiece.shape)) {
      ghostR++;
    }
    return ghostR;
  }

  isGhostCell(r: number, c: number): boolean {
    if (!this.hasStarted || this.gameOver || !this.currentPiece || this.board[r][c] !== null) return false;
    if (this.getCellColor(r, c) !== null) return false;

    const ghostR = this.getGhostRow();
    const localR = r - ghostR;
    const localC = c - this.pieceCol;

    return (
      localR >= 0 &&
      localR < this.currentPiece.shape.length &&
      localC >= 0 &&
      localC < this.currentPiece.shape[0].length &&
      this.currentPiece.shape[localR][localC] === 1
    );
  }

  getCellColor(r: number, c: number): string | null {
    if (this.hasStarted && !this.gameOver && this.currentPiece) {
      const localR = r - this.pieceRow;
      const localC = c - this.pieceCol;
      if (
        localR >= 0 &&
        localR < this.currentPiece.shape.length &&
        localC >= 0 &&
        localC < this.currentPiece.shape[0].length &&
        this.currentPiece.shape[localR][localC]
      ) {
        return this.currentPiece.color;
      }
    }
    return this.board[r][c];
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.hasStarted || this.gameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.moveLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.moveRight();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.softDrop();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.rotate();
        break;
      case ' ':
        event.preventDefault();
        this.hardDrop();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        this.togglePause();
        break;
    }
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

  onMinimize(): void {
    if (this.hasStarted && !this.gameOver && !this.isPaused) {
      this.togglePause();
    }
    this.minimize.emit();
  }

  onClose(): void {
    this.stopLoop();
    this.close.emit();
  }
}