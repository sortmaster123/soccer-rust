export type MoveResponse = {
    moveResult: MoveResult,
    gameState: 'P1Win' | 'P2Win' | 'P1OnTheMove' | 'P2OnTheMove'
}

export enum MoveResult {
  AlreadyTaken = 'AlreadyTaken',
  Moved = 'Moved',
  InvalidMove = 'InvalidMove',
}

export enum MoveDirection {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right", 
  UpLeft = "UpLeft", 
  UpRight = "UpRight",
  DownLeft = "DownLeft",
  DownRight = "DownRight"
}
