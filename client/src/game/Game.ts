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
  private piece: Piece | null

  constructor() {
    this.board = new Board()
    this.piece = null
  }

  public isGameOver(): boolean {
    return this.piece !== null && this.board.createsCollition(this.piece.getPositions())
  }

  public spawnRandomPiece(): void {
    this.piece = getRandomPiece()
  }

  public canDrop(): boolean {
    if (this.piece === null) throw Error()

    return this.board.canDrop(this.piece)
  }

  public drop(): void {
    if (this.isGameOver()) throw Error()
    if (this.piece === null) throw Error()
    if (!this.canDrop()) throw Error()

    this.piece.drop()
  }

  public merge(): void {
    if (this.isGameOver()) throw Error()

    if (this.piece === null) throw Error()

    if (this.board.canDrop(this.piece)) {
      throw Error()
    }

    this.board.merge(this.piece)
    this.piece = null
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

  public hasPiece(): boolean {
    return this.piece !== null
  }

  public getPiecePositions(): PiecePositions {
    if (!this.piece) throw Error()

    return this.piece.getPositions()
  }

  public shiftPieceLeft(): void {
    if (this.piece === null) throw Error()

    this.piece.shiftLeft()
  }

  public shiftPieceRight(): void {
    if (this.piece === null) throw Error()

    this.piece.shiftRight()
  }

  public rotatePieceRight(): void {
    if (this.piece === null) throw Error()

    this.piece.rotateRight()
  }

  public rotatePieceLeft(): void {
    if (this.piece === null) throw Error()
    
    this.piece.rotateLeft()
  }
}