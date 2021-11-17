import Piece from './pieces/Piece'
import Position from './Position'

export default class Board {
  private static readonly width: number = 10
  private static readonly height: number = 20

  private board: boolean[][]

  constructor() {
    this.initializeBoard()
  }

  private initializeBoard(): void {
    this.board = []
    for (let i = 0; i < Board.width; i++) {
      const newCol = []
      for (let j = 0; j < Board.height; j++) {
        newCol.push(false)
      }
      this.board.push(newCol)
    }
  }

  public canDrop(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice()

    for (const position of positionsCopy) {
      position.decreaseY()
    }

    for (const position of positionsCopy) {
      if (this.board[position.getX()][position.getY()]) {
        return false
      }
    }

    return true
  }

  public merge(piece: Piece): void {
    if (this.canDrop(piece)) {
      throw Error()
    }

    const positions = piece.getPositions()
    for (const position of positions) {
      this.board[position.getX()][position.getY()] = true
    }
  }

  private lineIsFull(yPos: number): boolean {
    for (let i = 0; i < Board.width; i++) {
      if (!this.board[i][yPos]) {
        return false
      }
    }

    return true
  }

  public hasLinesToBurn(): boolean {
    for (let j = 0; j < Board.height; j++) {
      if (this.lineIsFull(j)) {
        return true
      }
    }

    return false
  }

  private burnLine(yPos: number): void {
    for (let j = yPos; j < Board.height - 1; j++) {
      for (let i = 0; i < Board.width; i++) {
        this.board[i][j] = this.board[i][j + 1]
      }
    }

    const topRow = Board.height - 1
    for (let i = 0; i < Board.width; i++) {
      this.board[i][topRow] = false
    }
  }

  public burnLines(): void {
    if (!this.hasLinesToBurn()) throw Error()

    let j = 0
    while (j < Board.height) {
      if (this.lineIsFull(j)) {
        this.burnLine(j)
      } else {
        j++
      }
    }
  }

  public static getStartPosition(): Position {
    const rowsFromTheTop = 2
    return new Position(5, Board.height - 1 - rowsFromTheTop)
  }
}