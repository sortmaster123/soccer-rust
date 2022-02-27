import { MoveDirection } from "../pitch/pitch.component";
import { MoveResponse } from "../socket.service";

export class InitializeGame {
  static readonly type = '[GameState] Initialize Game';
  constructor() {}
}

export class ReceiveMove {
  static readonly type = '[GameState] Receive Move';
  constructor(public moveResponse: MoveResponse) {}
}

export class DrawMove {
  static readonly type = '[GameState] Draw Move';
  constructor(public moveDirection: MoveDirection) {}
}

export class DeclareWin {
  static readonly type = '[GameState] Declare Win';
  constructor() {}
}