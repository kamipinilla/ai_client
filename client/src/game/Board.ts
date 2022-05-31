import { range } from '../utils'
import Piece from './pieces/Piece'
import { PiecePositions } from './pieces/types'
import Position from './Position'

export default class Board {
  public static readonly width: number = 10
  public static readonly height: number = 20

  private board: boolean[][]

  constructor() {
    this.initializeBoard()
  }

  private initializeBoard(): void {
    this.board = []
    for (const i of range(Board.width)) {
      const newCol = []
      for (const j of range(Board.height)) {
        newCol.push(false)
      }
      this.board.push(newCol)
    }
  }

  private isWithinBounds(piecePositions: PiecePositions): boolean {
    for (const position of piecePositions) {
      const x = position.getX()
      const y = position.getY()
  
      if (x < 0 || x >= Board.width) {
        return false
      }
  
      if (y < 0 || y >= Board.height + 2) {
        return false
      }
    }

    return true
  }

  public createsCollision(piecePositions: PiecePositions): boolean {
    for (const position of piecePositions) {
      if (this.board[position.getX()][position.getY()]) {
        return true
      }
    }

    return false
  }

  public canDrop(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.decreaseY()
    }

    if (!this.isWithinBounds(positionsCopy)) {
      return false
    }

    if (this.createsCollision(positionsCopy)) {
      return false
    }

    return true
  }

  public merge(piece: Piece): void {
    if (this.canDrop(piece)) throw Error(`Can't merge floating piece`)

    const positions = piece.getPositions()
    for (const position of positions) {
      this.board[position.getX()][position.getY()] = true
    }
  }

  private lineIsFull(yPos: number): boolean {
    for (const i of range(Board.width)) {
      if (!this.board[i][yPos]) {
        return false
      }
    }

    return true
  }

  public hasLinesToBurn(): boolean {
    return this.countLinesToBurn() !== 0
  }

  public countLinesToBurn(): number {
    let count = 0

    for (const j of range(Board.height)) {
      if (this.lineIsFull(j)) {
        count++
      }
    }

    return count
  }


  private burnLine(yPos: number): void {
    for (const j of range(yPos, Board.height - 1)) {
      for (const i of range(Board.width)) {
        this.board[i][j] = this.board[i][j + 1]
      }
    }

    const topRow = Board.height - 1
    for (const i of range(Board.width)) {
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

  public canMoveLeft(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.decreaseX()
    }

    if (!this.isWithinBounds(positionsCopy) || this.createsCollision(positionsCopy)) {
      return false
    }

    return true
  }

  public canMoveRight(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.increaseX()
    }

    if (!this.isWithinBounds(positionsCopy) || this.createsCollision(positionsCopy)) {
      return false
    }

    return true
  }

  public isPositionFilled(position: Position): boolean {
    return this.board[position.getX()][position.getY()]
  }

  public static getStartPosition(): Position {
    return new Position(5, Board.height - 1)
  }
}