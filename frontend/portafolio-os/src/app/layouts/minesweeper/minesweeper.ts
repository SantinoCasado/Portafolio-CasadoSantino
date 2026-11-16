import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type DifficultyKey = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.css'
})
export class Minesweeper implements OnInit {
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public langService = inject(LanguageService);

  isMaximized = false;
  showDifficultyMenu = true; // Arranca mostrando la selección de dificultad
  currentDifficulty: DifficultyKey = 'easy';

  readonly difficulties: Record<DifficultyKey, DifficultyConfig> = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 14, cols: 14, mines: 30 },
    hard: { rows: 16, cols: 24, mines: 65 }
  };

  rows = 9;
  cols = 9;
  totalMines = 10;

  board: Cell[][] = [];
  gameOver = false;
  gameWon = false;
  flagsPlaced = 0;
  faceState: 'smile' | 'ooh' | 'dead' | 'winner' = 'smile';
  firstClick = true;

  timer = 0;
  private timerInterval: any;

  ngOnInit(): void {
    this.buildEmptyBoard();
  }

  selectDifficulty(diff: DifficultyKey): void {
    this.currentDifficulty = diff;
    const config = this.difficulties[diff];
    this.rows = config.rows;
    this.cols = config.cols;
    this.totalMines = config.mines;
    this.showDifficultyMenu = false;
    this.resetGame();
  }

  openDifficultySelector(): void {
    this.stopTimer();
    this.showDifficultyMenu = true;
  }

  resetGame(): void {
    this.stopTimer();
    this.timer = 0;
    this.gameOver = false;
    this.gameWon = false;
    this.flagsPlaced = 0;
    this.faceState = 'smile';
    this.firstClick = true;
    this.buildEmptyBoard();
  }

  private buildEmptyBoard(): void {
    this.board = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      this.board.push(row);
    }
  }

  private placeMines(excludeRow: number, excludeCol: number): void {
    let minesPlaced = 0;
    while (minesPlaced < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      if (!this.board[r][c].isMine && !(r === excludeRow && c === excludeCol)) {
        this.board[r][c].isMine = true;
        minesPlaced++;
      }
    }
    this.calculateNeighbors();
  }

  private calculateNeighbors(): void {
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].isMine) continue;
        let count = 0;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.board[nr][nc].isMine) {
            count++;
          }
        }
        this.board[r][c].neighborMines = count;
      }
    }
  }

  revealCell(cell: Cell): void {
    if (this.showDifficultyMenu || this.gameOver || this.gameWon || cell.isRevealed || cell.isFlagged) return;

    if (this.firstClick) {
      this.firstClick = false;
      this.placeMines(cell.row, cell.col);
      this.startTimer();
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      this.triggerGameOver();
      return;
    }

    if (cell.neighborMines === 0) {
      this.revealEmptyNeighbors(cell.row, cell.col);
    }

    this.checkWinCondition();
  }

  private revealEmptyNeighbors(r: number, c: number): void {
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        const neighbor = this.board[nr][nc];
        if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
          neighbor.isRevealed = true;
          if (neighbor.neighborMines === 0) {
            this.revealEmptyNeighbors(nr, nc);
          }
        }
      }
    }
  }

  toggleFlag(event: MouseEvent, cell: Cell): void {
    event.preventDefault();
    if (this.showDifficultyMenu || this.gameOver || this.gameWon || cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    this.flagsPlaced += cell.isFlagged ? 1 : -1;
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    this.faceState = 'dead';
    this.stopTimer();
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.isMine) cell.isRevealed = true;
      }
    }
  }

  private checkWinCondition(): void {
    let unrevealedSafeCells = 0;
    for (const row of this.board) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      this.gameWon = true;
      this.faceState = 'winner';
      this.stopTimer();

      // Fix del -01: marca todas las minas reales y clava el contador en 000
      for (const row of this.board) {
        for (const cell of row) {
          cell.isFlagged = cell.isMine;
        }
      }
      this.flagsPlaced = this.totalMines;
    }
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timer < 999) this.timer++;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  formatCounter(num: number): string {
    const clamped = Math.max(-99, Math.min(999, num));
    if (clamped < 0) return '-' + Math.abs(clamped).toString().padStart(2, '0');
    return clamped.toString().padStart(3, '0');
  }

  onMouseDown(): void {
    if (!this.gameOver && !this.gameWon && !this.showDifficultyMenu) this.faceState = 'ooh';
  }

  onMouseUp(): void {
    if (!this.gameOver && !this.gameWon && !this.showDifficultyMenu) this.faceState = 'smile';
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

  onMinimize(): void { this.minimize.emit(); }
  onClose(): void { 
    this.stopTimer();
    this.close.emit(); 
  }
}