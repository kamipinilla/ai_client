import { P5Instance as p5 } from 'react-p5-wrapper'
import Game from '../game/Game'
import { range } from '../utils'

enum ActionKey {
  Left = 'n',
  Right = 'm',

  RotateRight = 'd',
  RotateLeft = 's',

  Start = 'u',
}

export default function sketch(t: p5): void {
  const startLevel = 0
  const uiSize = 30

  let score: number
  let isPaused: boolean
  let tetrisLines: number

  let game: Game

  t.setup = () => {
    t.createCanvas(uiSize * 10 + 225, uiSize * 20)

    isPaused = false
    score = 0
    tetrisLines = 0

    game = new Game()
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
        if (game.pieceCanRotateRight()) {
          game.rotatePieceRight()
        }
        break
      }
      case ActionKey.RotateLeft: {
        if (game.pieceCanRotateLeft()) {
          game.rotatePieceLeft()
        }
        break
      }
      case ActionKey.Start: {
        isPaused = !isPaused
      }
    }
  }

  function getDropCount(): number {
    const level = getLevel()

    if (level >= 29) return 1
    if (level >= 19) return 2
    if (level >= 16) return 3
    if (level >= 13) return 4
    if (level >= 10) return 5
    if (level === 9) return 6
    if (level === 8) return 8
    if (level === 7) return 13
    if (level === 6) return 18
    if (level === 5) return 23
    if (level === 4) return 28
    if (level === 3) return 33
    if (level === 2) return 38
    if (level === 1) return 43
    if (level === 0) return 48
  
    throw Error(`Invalid level: ${level}`)
  }

  function getTransitionCount(): number {
    if (startLevel <= 9) {
      return startLevel * 10 + 10
    } else if (startLevel >= 26) {
      return 200
    } else {
      return Math.max(100, startLevel * 10 - 50)
    }
  }

  function getLevel(): number {
    const transition = getTransitionCount()

    const lines = game.getLines()
    if (lines < transition) return startLevel
    else return startLevel + Math.floor((lines - transition + 10) / 10)
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

    if (t.frameCount % getDropCount() === 0) {
      if (game.canDrop()) {
        game.drop()
      } else {
        game.merge()
        if (game.hasLinesToBurn()) {
          addScoreOfLinesToBurn()
          game.burnLines()
        }
        game.updateCurrentPiece()
      }
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
    t.rect(0, 0, uiSize * 10, uiSize * 20)
  }

  function displayBlock(x: number, y: number, isPiece: boolean) {
    t.strokeWeight(2)
    t.stroke(0)
    const fillParams: [number, number, number] = isPiece ? [0, 255, 255] : [0, 0, 255]
    t.fill(...fillParams)

    t.square(uiSize * x, uiSize * y, uiSize)
  }

  function displayBoard() {
    for (const i of range(game.getWidth())) {
      for (const j of range(game.getHeight())) {
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
    const newAnchorX = uiSize * 8
    const newAnchorY = uiSize * -7
    for (const position of nextPiecePositions) {
      const x = position.getX()
      const y = position.getY()
      t.square(newAnchorX + uiSize * x, newAnchorY + uiSize * y, uiSize)
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