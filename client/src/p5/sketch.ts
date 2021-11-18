import { P5Instance as p5 } from 'react-p5-wrapper'
import { getOutcomes } from '../api/stackRabbit'
import Game from '../game/Game'
import { Outcome, StackRabbitInput } from '../types'

enum ActionKey {
  Left = 'n',
  Right = 'm',

  RotateRight = 'd',
  RotateLeft = 's',

  Start = 'u',
}

function getLevelFrom18(lines: number): number {
  const transition = 130
  if (lines < transition) return 18
  else return 18 + Math.floor((lines - transition + 10) / 10)
}

function getLevelFrom19(lines: number): number {
  const transition = 140
  if (lines < transition) return 19
  else return 19 + Math.floor((lines - transition + 10) / 10)
}

function getDropCount(level: number): number {
  if (level >= 29) return 1
  if (level >= 19) return 2
  if (level >= 16) return 3
  if (level >= 13) return 4
  if (level >= 10) return 5
  if (level === 9) return 6

  return 60
}

function getTapSpeedStr(tapId: number) {
  let str = 'X'
  for (let i = 0; i < tapId - 1; i++) {
    str += '.'
  }
  return str
}

export default function sketch(t: p5): void {
  const startLevel: number = 19
  const tapId: number = 5
  const withNextBox: boolean = true

  let score: number = 0
  let isPaused: boolean
  let tetrisLines: number = 0
  let outcomes: Outcome[]

  let game: Game
  const size = 30

  t.setup = () => {
    t.createCanvas(size * 10 + 225, size * 20)

    game = new Game()
    updatePlacement()
    isPaused = false
  }

  t.draw = () => {
    if (!isPaused) {
      update()
    }
    display()
  }

  t.keyTyped = () => {
    switch (t.key) {
      case ActionKey.Left: {
        if (game.pieceCanMoveLeft()) {
          game.shiftPieceLeft()
        }
        break
      }
      case ActionKey.Right: {
        if (game.pieceCanMoveRight()) {
          game.shiftPieceRight()
        }
        break
      }
      case ActionKey.RotateRight: {
        game.rotatePieceRight()
        break
      }
      case ActionKey.RotateLeft: {
        game.rotatePieceLeft()
        break
      }
      case ActionKey.Start: {
        isPaused = !isPaused
      }
    }
  }

  function getLevel() {
    if (startLevel === 18) {
      return getLevelFrom18(game.getLines())
    }
    if (startLevel === 19) {
      return getLevelFrom19(game.getLines())
    }
    
    return startLevel
  }

  function addScoreOfLinesToBurn(): void {
    const level = getLevel()
    switch (game.countLinesToBurn()) {
      case 1: {
        score += 40 * (level + 1)
        break
      }
      case 2: {
        score += 100 * (level + 1)
        break
      }
      case 3: {
        score += 300 * (level + 1)
        break
      }
      case 4: {
        score += 1200 * (level + 1)
        tetrisLines += 4
        break
      }
      default: throw Error()
    }
  }

  function update() {
    if (t.frameCount < 90 || game.isGameOver()) return

    if (t.frameCount % getDropCount(getLevel()) === 0) {
      if (game.canDrop()) {
        game.drop()
      } else {
        game.merge()
        if (game.hasLinesToBurn()) {
          addScoreOfLinesToBurn()
          game.burnLines()
        }
        game.updateCurrentPiece()
        updatePlacement()
      }
    }
  }

  async function updatePlacement() {
    const input: StackRabbitInput = {
      withNextBox,
      board: game.getBoard(),
      currentPiece: game.getPiece(),
      nextPiece: game.getNextPiece(),
      level: getLevel(),
      lines: game.getLines(),
      reactionTime: 99,
      tapSpeed: getTapSpeedStr(tapId),
    }
    outcomes = await getOutcomes(input)
    processOutcomes()
  }

  function processOutcomes() {
    const bestOutcome = outcomes[0]
    if (bestOutcome.isSpecialMove) {
      game.getPiece().setCanPierce()
    }
    const { numShifts, numRightRot } = bestOutcome

    const absNumShifts = Math.abs(numShifts)
    for (let i = 0; i < absNumShifts; i++) {
      if (numShifts > 0) {
        game.shiftPieceRight()
      } if (numShifts < 0) {
        game.shiftPieceLeft()
      }
    }

    for (let i = 0; i < numRightRot; i++) {
      game.rotatePieceRight()
    }
  }

  function flipVertically() {
    t.scale(1, -1)
    t.translate(0, -t.height)
  }

  function displayBackground() {
    t.background(0)

    t.fill(0)
    t.strokeWeight(2)
    t.stroke(255)
    t.rect(0, 0, size * 10, size * 20)
  }

  function displayBlock(x: number, y: number, isPiece: boolean) {
    t.strokeWeight(2)
    t.stroke(0)
    t.fill(isPiece ? 255 : 0, isPiece ? 255 : game.getPiece().getCanPierce() ? 0 : 255, 255)

    if (isPiece) {
      if (game.getPiece().getCanPierce()) {
        t.fill(255, 255, 0)
      } else {
        t.fill(0, 255, 255)
      }
    } else {
      t.fill(0, 0, 255)
    }

    t.square(size * x, size * y, size)
  }

  function displayBoard() {
    for (let i = 0; i < game.getWidth(); i++) {
      for (let j = 0; j < game.getHeight(); j++) {
        if (game.isPositionFilled(i, j)) {
          displayBlock(i, j, false)
        }
      }
    }
  }

  function displayPiece() {
    const piecePositions = game.getPiecePositions()
    for (const position of piecePositions) {
      displayBlock(position.getX(), position.getY(), true)
    }
  }

  function displayNextPiece() {
    t.strokeWeight(2)
    t.stroke(0)
    t.fill(0, 0, 255)

    const nextPiecePositions = game.getNextPiecePositions()
    const newAnchorX = size * 8
    const newAnchorY = size * -7
    for (const position of nextPiecePositions) {
      const x = position.getX()
      const y = position.getY()
      t.square(newAnchorX + size * x, newAnchorY + size * y, size)
    }
  }

  function show(text: string, x: number, y: number): void {
    t.push()
    t.translate(x, y)
    t.scale(1, -1)
    t.text(text, 0, 0);
    t.pop()
  }

  function displayLines() {
    t.textSize(60)
    show(game.getLines().toString(), 370, 30)
  }

  function displayLevel() {
    t.textSize(60)
    show(getLevel().toString(), 370, 110)
  }

  function displayScore() {
    t.textSize(50)
    show(score.toString(), 310, 500)
  }

  function displayTetrisRate() {
    const lines = game.getLines()
    if (lines === 0) return

    t.textSize(50)
    const rate = Math.floor((tetrisLines * 100) / lines)
    show(rate.toString() + "%", 360, 200)
  }

  function display() {
    flipVertically()
    displayBackground()
    displayBoard()
    displayPiece()
    displayNextPiece()
    displayLines()
    displayLevel()
    displayScore()
    displayTetrisRate()
  }
}