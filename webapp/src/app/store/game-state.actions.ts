import { MoveDirection } from "../pitch/pitch.component";

export class InitializeGame {
  static readonly type = '[GameState] Initialize Game';
  constructor() {}
}

export class AcceptMove {
  static readonly type = '[GameState] Move Accepted';
  constructor(public moveDirection: MoveDirection) {}
}