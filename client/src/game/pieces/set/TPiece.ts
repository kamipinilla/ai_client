import Position from '../../Position'
import Piece from '../Piece'
import { NumStates, PieceName, PiecePositions } from '../types'

export default class TPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName

  constructor(anchor: Position) {
    super(anchor)

    this.name = 'T'
    this.numStates = 4
  }

  protected override getPosition0(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].decreaseX()
    positions[1].decreaseY()
    positions[2].increaseX()

    return positions
  }

  protected override getPosition1(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseY()
    positions[1].decreaseX()
    positions[2].decreaseY()

    return positions
  }

  protected override getPosition2(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseX()
    positions[1].increaseY()
    positions[2].decreaseX()

    return positions
  }

  protected override getPosition3(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].decreaseY()
    positions[1].increaseX()
    positions[2].increaseY()

    return positions
  }
}