import { P5Instance as p5 } from 'react-p5-wrapper'
import Game from '../game/Game'
import { range } from '../utils'

class Key {
  private static values = new Array<Key>()

  static readonly N = new this('N', 78)
  static readonly M = new this('M', 77)
  static readonly D = new this('D', 68)
  static readonly S = new this('S', 83)
  static readonly U = new this('U', 85)

  private constructor(
    private name: string,
    private code: number,
  ) {
    Key.values.push(this)
  }

  public getCode(): number {
    return this.code
  }

  public static valueOf(code: number): Key | null {
    const value = this.values.find(value => value.code === code)
    return value ?? null
  }

  public toString(): string {
    return this.name
  }
}

class Action {
  private static values = new Array<Action>()

  static readonly Left = new this('Left', Key.N)
  static readonly Right = new this('Right', Key.M)
  static readonly RotateRight = new this('RotateRight', Key.D)
  static readonly RotateLeft = new this('RotateLeft', Key.S)
  static readonly Start = new this('Start', Key.U)

  public getKey(): Key {
    return this.key
  }

  private constructor(
    private name: string,
    private key: Key,
  ) {
    Action.values.push(this)
  }

  public static valueOf(key: Key): Action | null {
    const value = this.values.find(value => value.key === key)
    return value ?? null
  }

  public toString(): string {
    return this.name
  }
}

export default function sketch(t: p5): void {
  const startLevel = 12
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
    checkKeys()
    if (!isPaused) {
      update()
    }
    display()
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

  t.keyTyped = () => {
    if (t.keyCode === Action.Start.getKey().getCode()) {
      isPaused = !isPaused
    }
  }

  let dasCounter = 0
  let rotateIsPressed = false
  let isShifting = false

  function processShiftAction(canShift: () => boolean, doShift: () => void): void {
    if (canShift()) {
      if (!isShifting) {
        dasCounter = 0
        doShift()
        isShifting = true
      } else {
        if (dasCounter === 16) {
          dasCounter = 10
          doShift()
        } else {
          dasCounter++
        }
      }
    } else {
      if (!isShifting) {
        dasCounter = 16
      } else if (dasCounter !== 16) {
        dasCounter++
      }
    }
  }

  function checkKeys() {
    const left = t.keyIsDown(Action.Left.getKey().getCode())
    const right = t.keyIsDown(Action.Right.getKey().getCode())
    const rotateLeft = t.keyIsDown(Action.RotateLeft.getKey().getCode())
    const rotateRight = t.keyIsDown(Action.RotateRight.getKey().getCode())

    if (left !== right) {
      const canShift = left ? game.pieceCanMoveLeft.bind(game) : game.pieceCanMoveRight.bind(game)
      const doShift = left ? game.shiftPieceLeft.bind(game) : game.shiftPieceRight.bind(game)
      
      processShiftAction(canShift, doShift)
    }

    if (isShifting && !left && !right) {
      isShifting = false
    }

    if (rotateLeft !== rotateRight && !rotateIsPressed) {
      rotateIsPressed = true

      if (rotateLeft) {
        if (game.pieceCanRotateLeft()) {
          game.rotatePieceLeft()
        }
      } else {
        if (game.pieceCanRotateRight()) {
          game.rotatePieceRight()
        }
      }
    }

    if (rotateIsPressed && !rotateLeft && !rotateRight) {
      rotateIsPressed = false
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

  function displayDasCounter() {
    t.textSize(50)
    show(dasCounter.toString(), 360, 250)
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
    displayDasCounter()
  }
}