import Board from './game/Board'
import Piece from './game/pieces/Piece'

export interface StackRabbitInput {
  withNextBox: boolean

  board: Board
  currentPiece: Piece
  nextPiece: Piece | null
  level: number
  lines: number
  reactionTime: number
  tapSpeed: string
}

export interface Outcome {
  numShifts: number
  numRightRot: number
  score: number
  isSpecialMove: boolean
}