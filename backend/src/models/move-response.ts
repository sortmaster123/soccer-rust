export type MoveResponse = {
    moveResult: MoveResult,
    gameState: GameResult,
}

export enum GameResult {
  SwitchPlayers = 'SwitchPlayers',
  ContinueMove = 'ContinueMove',
  P1Win = 'P1Win',
  P2Win = 'P2Win',
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
