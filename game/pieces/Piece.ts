import Position from '../Position'
import { NumStates, PiecePositions, State } from './types'

export default abstract class Piece {
  protected anchor: Position
  protected state: State
  
  protected readonly abstract numStates: NumStates
  
  constructor(anchor: Position) {
    this.anchor = anchor
    this.state = 0
  }

  public shiftRight(): void {
    this.anchor.increaseX()
  }

  public shiftLeft(): void {
    this.anchor.decreaseX()
  }

  public drop(): void {
    this.anchor.decreaseY()
  }

  public rotateRight(): void {
    this.state = (this.state + 1) % this.numStates as State
  }

  public rotateLeft(): void {
    this.state = (this.state - 1) % this.numStates as State
  }

  public abstract getPositions(): PiecePositions

  protected getCopiedAnchor(): PiecePositions {
    return [
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
    ]
  }
}