import Position from '../../Position'
import Piece from '../Piece'
import { NumStates, PieceName, PiecePositions } from '../types'

export default class OPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName = 'O'

  constructor(anchor: Position) {
    super(anchor)

    this.numStates = 1
  }

  public getPositions(): PiecePositions {
    switch (this.state) {
      case 0: {
        return this.getPosition0()
      }
      default: {
        throw Error()
      }
    }
  }

  private getPosition0(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseX()
    
    positions[1].decreaseY()

    positions[2].increaseX()
    positions[2].decreaseY()

    return positions
  }
}