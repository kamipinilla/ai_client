import Board from './Board'
import Piece from './pieces/Piece'

export default class Game {
  private board: Board
  private piece: Piece | null

  constructor() {
    this.board = new Board()
    this.piece = null
  }
}