import Position from '../Position'
import { NumStates, PieceName, PiecePositions, State } from './types'

function modulo(n: number, m: number): number {
  return ((n % m) + m) % m
}

export default abstract class Piece {
  protected anchor: Position
  protected state: State
  
  protected readonly abstract numStates: NumStates
  protected readonly abstract name: PieceName
  
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
    this.state = modulo(this.state + 1, this.numStates) as State
  }

  public rotateLeft(): void {
    this.state = modulo(this.state - 1, this.numStates) as State
  }

  public getName(): PieceName {
    return this.name
  }

  public isSameKind(other: Piece): boolean {
    return this.name === other.name
  }

  public getPositions(): PiecePositions {
    switch (this.state) {
      case 0: {
        return this.getPosition0()
      }
      case 1: {
        return this.getPosition1()
      }
      case 2: {
        return this.getPosition2()
      }
      case 3: {
        return this.getPosition3()
      }
      default: {
        throw Error(`Invalid state: ${this.state}`)
      }
    }
  }

  protected getPosition0(): PiecePositions {
    throw Error(`Not implemented`)
  }

  protected getPosition1(): PiecePositions {
    throw Error(`Not implemented`)
  }

  protected getPosition2(): PiecePositions {
    throw Error(`Not implemented`)
  }

  protected getPosition3(): PiecePositions {
    throw Error(`Not implemented`)
  }

  protected getCopiedAnchor(): PiecePositions {
    return [
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
    ]
  }
}