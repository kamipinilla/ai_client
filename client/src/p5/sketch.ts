import { P5Instance as p5 } from 'react-p5-wrapper'
import Game from '../game/Game'

enum ActionKey {
  Left = 'n',
  Right = 'm',

  RotateRight = 'd',
  RotateLeft = 's',

  Start = 'u',
}

export default function sketch(t: p5): void {
  const size = 30

  let game: Game
  let isPaused: boolean

  t.setup = () => {
    t.createCanvas(size * 10 + 200, size * 20)

    game = new Game()
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
        game.shiftPieceLeft()
        break
      }
      case ActionKey.Right: {
        game.shiftPieceRight()
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

  function update() {
    if (t.frameCount < 90 || game.isGameOver()) return

    if (t.frameCount % 4 === 0) {
      if (game.canDrop()) {
        game.drop()
      } else {
        game.merge()
        if (game.hasLinesToBurn()) {
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
    t.rect(0, 0, size * 10, size * 20)
  }

  function displayBlock(x: number, y: number, isPiece: boolean) {
    t.strokeWeight(2)
    t.stroke(0)
    t.fill(isPiece ? 255 : 0, isPiece ? 255 : 0, 255)

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
    const newAnchorY = size * -9
    for (const position of nextPiecePositions) {
      const x = position.getX()
      const y = position.getY()
      t.square(newAnchorX + size * x, newAnchorY + size * y, size)
    }

  }

  function display() {
    flipVertically()
    displayBackground()
    displayBoard()
    displayPiece()
    displayNextPiece()
  }
}