import Board from '../game/Board'
import Position from '../game/Position'
import { InitialOutcome, StackRabbitInput } from '../types'
import path from 'path'
import { get } from './rest'

function getEncodedBoard(board: Board): string {
  let boardStr = ''
  for (let j = Board.height - 1; j >= 0; j--) {
    for (let i = 0; i < Board.width; i++) {
      boardStr += board.isPositionFilled(new Position(i, j)) ? '1' : '0'
    }
  }
  return boardStr
}

function getTapSpeedStr(tapId: number) {
  let str = 'X'
  for (let i = 0; i < tapId - 1; i++) {
    str += '.'
  }
  return str
}

export async function getOutcomes(input: StackRabbitInput): Promise<InitialOutcome[]> {
  const host = 'http://localhost:8000'
  const entryName = 'engine-new'
  const encodedBoard = getEncodedBoard(input.board)
  const currentPiece = input.currentPiece.getName()
  const nextPiece = input.nextPiece ? input.nextPiece.getName() : 'null'
  const level = input.level.toString()
  const lines = input.lines.toString()
  const reactionTime = input.reactionTime.toString()
  const tapSpeed = getTapSpeedStr(input.tapId)

  const requestUrl = host + '/' + path.join(
    entryName,
    encodedBoard,
    currentPiece,
    nextPiece,
    level,
    lines,
    '0', '0', '0', '0',
    reactionTime,
    tapSpeed,
    'false',
  )

  const response = await get(requestUrl)
  if (response.ok) {
    const responseStr = await response.text()
    const outcomes = parseStackRabbitResponse(responseStr)
    return outcomes
  } else {
    throw Error(`Status ${response.status}: ${response.statusText}`)
  }
}

function parseStackRabbitResponse(response: string): InitialOutcome[] {
  return JSON.parse(response) as InitialOutcome[]
}