import { FrameChar, FrameInput, Rotation, Shift } from '../types'

export enum ActionKey {
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

export function getLevel(startLevel: number, lines: number) {
  if (startLevel === 18) {
    return getLevelFrom18(lines)
  }
  if (startLevel === 19) {
    return getLevelFrom19(lines)
  } else {
    return startLevel
  }
}

export function getDropCount(level: number): number {
  if (level >= 29) return 1
  if (level >= 19) return 2
  if (level >= 16) return 3
  if (level >= 13) return 4
  if (level >= 10) return 5
  if (level === 9) return 6

  return 60
}

export function getTapSpeedStr(tapId: number) {
  let str = 'X'
  for (let i = 0; i < tapId - 1; i++) {
    str += '.'
  }
  return str
}

export function getFrameInput(frameChar: FrameChar): FrameInput {
  switch (frameChar) {
    case '.': return { rotation: null, shift: null }

    case 'A': return { rotation: Rotation.Right, shift: null }
    case 'B': return { rotation: Rotation.Left, shift: null }

    case 'L': return { rotation: null, shift: Shift.Left }
    case 'R': return { rotation: null, shift: Shift.Right }

    case 'E': return { rotation: Rotation.Right, shift: Shift.Left }
    case 'F': return { rotation: Rotation.Left, shift: Shift.Left }
    case 'I': return { rotation: Rotation.Right, shift: Shift.Right }
    case 'G': return { rotation: Rotation.Left, shift: Shift.Right }
  }
}