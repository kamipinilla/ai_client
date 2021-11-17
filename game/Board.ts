export default class Board {
  private static readonly width: number = 10
  private static readonly height: number = 20

  private board: boolean[][]

  constructor() {
    this.board = []
    for (let i = 0; i < Board.width; i++) {
      const newCol = []
      for (let j = 0; j < Board.height; j++) {
        newCol.push(false)
      }
      this.board.push(newCol)
    }
  }
}