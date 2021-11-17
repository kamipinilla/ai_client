import Board from './Board'
import Piece from './pieces/Piece'
import IPiece from './pieces/set/IPiece'
import JPiece from './pieces/set/JPiece'
import LPiece from './pieces/set/LPiece'
import OPiece from './pieces/set/OPiece'
import SPiece from './pieces/set/SPiece'
import TPiece from './pieces/set/TPiece'
import ZPiece from './pieces/set/ZPiece'
import { PiecePositions } from './pieces/types'
import Position from './Position'

function getRandomPiece(): Piece {
  const anchor = Board.getStartPosition()
  const numPieces = 7
  const randomInt = Math.floor(Math.random() * numPieces)
  switch (randomInt) {
    case 0: return new OPiece(anchor)
    case 1: return new IPiece(anchor)
    case 2: return new SPiece(anchor)
    case 3: return new ZPiece(anchor)
    case 4: return new LPiece(anchor)
    case 5: return new JPiece(anchor)
    case 6: return new TPiece(anchor)
    default: throw Error()
  }
}
export default class Game {
  private board: Board
  private piece: Piece
  private nextPiece: Piece
  private gameOver: boolean

  constructor() {
    this.board = new Board()
    
    this.gameOver = false
    this.nextPiece = getRandomPiece()
    this.updateCurrentPiece()
  }

  public isGameOver(): boolean {
    return this.gameOver
  }

  public updateCurrentPiece(): void {
    this.piece = this.nextPiece
    this.setupNextPiece()

    this.checkIfGameOver()
  }

  private checkIfGameOver() {
    if (this.board.createsCollition(this.piece.getPositions())) {
      this.gameOver = true
    }
  }

  private setupNextPiece(): void {
    let nextPiece = getRandomPiece()
    if (this.piece.equals(nextPiece)) {
      nextPiece = getRandomPiece()
    }

    this.nextPiece = nextPiece
  }

  public canDrop(): boolean {
    return this.board.canDrop(this.piece)
  }

  public drop(): void {
    if (this.isGameOver()) throw Error()
    if (!this.canDrop()) throw Error()

    this.piece.drop()
  }

  public merge(): void {
    if (this.isGameOver()) throw Error()
    if (this.board.canDrop(this.piece)) throw Error()

    this.board.merge(this.piece)
  }

  public hasLinesToBurn(): boolean {
    return this.board.hasLinesToBurn()
  }

  public burnLines(): void {
    if (this.isGameOver()) throw Error()
    if (!this.hasLinesToBurn()) throw Error()

    this.board.burnLines()
  }

  public isPositionFilled(x: number, y: number): boolean {
    const position = new Position(x, y)
    return this.board.isPositionFilled(position)
  }

  public getWidth(): number {
    return Board.width
  }

  public getHeight(): number {
    return Board.height
  }

  public getPiecePositions(): PiecePositions {
    return this.piece.getPositions()
  }

  public getNextPiecePositions(): PiecePositions {
    return this.nextPiece.getPositions()
  }

  public shiftPieceLeft(): void {
    this.piece.shiftLeft()
  }

  public shiftPieceRight(): void {
    this.piece.shiftRight()
  }

  public rotatePieceRight(): void {
    this.piece.rotateRight()
  }

  public rotatePieceLeft(): void {
    this.piece.rotateLeft()
  }
}