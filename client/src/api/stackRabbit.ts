import Board from '../game/Board'
import Position from '../game/Position'
import { Outcome, StackRabbitInput } from '../types'
import path from 'path'
import { get } from './rest'
import { range, reversed } from '../utils'

function getEncodedBoard(board: Board): string {
  let boardStr = ''
  for (const j of reversed(range(Board.height))) {
    for (const i of range(Board.width)) {
      boardStr += board.isPositionFilled(new Position(i, j)) ? '1' : '0'
    }
  }
  return boardStr
}

export async function getOutcomes(input: StackRabbitInput): Promise<Outcome[]> {
  const host = 'http://localhost:8000'
  const entryName = input.withNextBox ? 'sync-nb-all' : 'sync-nnb-all'
  const encodedBoard = getEncodedBoard(input.board)
  const currentPiece = input.currentPiece.getName()
  const nextPiece = input.nextPiece ? input.nextPiece.getName() : 'null'
  const level = input.level.toString()
  const lines = input.lines.toString()
  const reactionTime = input.reactionTime.toString()
  const tapSpeed = input.tapSpeed

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

function parseStackRabbitResponse(response: string): Outcome[] {
  const outcomeStrArray = response.split(';')
  return outcomeStrArray.map((outcomeStr): Outcome => {

    const outcomeArray = outcomeStr.split('|')
    
    const placement = outcomeArray[0].split(',')
    const numRightRot = parseInt(placement[0])
    const numShifts = parseInt(placement[1])

    const score = parseFloat(outcomeArray[outcomeArray.length - 2])
    const isSpecialMove = outcomeArray[outcomeArray.length - 1] === 'true'

    return {
      numShifts,
      numRightRot,
      score,
      isSpecialMove,
    }
  })
}