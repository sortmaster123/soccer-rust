import { check } from "prettier";
import { Direction } from "readline";

type Point = {
  x: number;
  y: number;
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

export enum MoveResult {
  AlreadyTaken = 'AlreadyTaken',
  Moved = 'Moved',
  InvalidMove = 'InvalidMove'
}

export enum GameResult {
  SwitchPlayers = 'SwitchPlayers',
  ContinueMove = 'ContinueMove',
  P1Win = 'P1Win',
  P2Win = 'P2Win',
}

export type MoveResponse = {
  moveResult: MoveResult,
  gameState: GameResult,
}

export class GameBoard {

  private boardSizeX = 13;
  private boardSizeY = 9;
  private curPos: Point;

  private vertical: boolean[][];
  private horizontal: boolean[][];
  private backslash: boolean[][];
  private slash: boolean[][];

  constructor() { this.initializeGame() }

  initializeGame(){
    this.curPos = {x: 5, y: 6};
    this.vertical = [];
    this.horizontal = [];
    this.backslash = [];
    this.slash = [];
    for(let i = 0; i < this.boardSizeX; i++){
      this.vertical[i] = []
      this.horizontal[i] = []
      this.backslash[i] = []
      this.slash[i] = []
      for(let j = 0; j < this.boardSizeY; j++){
        this.vertical[i][j] = false
        this.horizontal[i][j] = false
        this.backslash[i][j] = false
        this.slash[i][j] = false
      }
    }
    console.log('start game point in ', this.getCords())
  }

  move(moveDir: MoveDirection): MoveResponse {
    if(this.isEdgeAlreadyMarked(moveDir)){
      return {
        moveResult: MoveResult.AlreadyTaken,
        gameState: GameResult.ContinueMove,
      };
    }

    let legality = this.checkIfMoveIsInBounds(moveDir)
    if(legality != undefined){
      return legality;
    }

    this.markEdge(moveDir);
    
    let offsets = this.directionToOffset(moveDir);
    this.movePoint(offsets.x, offsets.y);

    let hasWin = this.checkForWin();
    if(hasWin != undefined){
      return hasWin;
    }

    return {
      moveResult: MoveResult.Moved,
      gameState: GameResult.ContinueMove,
    };
  }

  private checkIfMoveIsInBounds(moveDir: MoveDirection): MoveResponse | undefined {
    let curPoint = this.getCords()
    let offset = this.directionToOffset(moveDir)
    let newPoint = {
      x: curPoint.x + offset.x,
      y: curPoint.y + offset.y
    }

    if(newPoint.x > 9 || newPoint.x < 1){
      return {
        gameState: GameResult.ContinueMove,
        moveResult: MoveResult.InvalidMove,
      }
    }

    if((newPoint.y < 1 || newPoint.y > 11) && newPoint.x != 4 && newPoint.x != 5 && newPoint.x !== 6){
      return {
        gameState: GameResult.ContinueMove,
        moveResult: MoveResult.InvalidMove,
      }
    }

    return undefined;
  }

  private checkForWin(): MoveResponse | undefined {
    let curPos = this.getCords();

    if(curPos.x !== 4 && curPos.x !== 5 && curPos.x !== 6){
      return undefined;
    }

    if(curPos.y == 0){
      return {
        moveResult: MoveResult.Moved,
        gameState: GameResult.P1Win,
      }
    }

    if(curPos.y == 12){
      return {
        moveResult: MoveResult.Moved,
        gameState: GameResult.P2Win,
      }
    }
    return undefined;
  }

  getCords(): Point{
    return {...this.curPos};
  }

  private isEdgeAlreadyMarked(moveDir: MoveDirection): boolean {
    switch(moveDir){
      case MoveDirection.Up:
        return this.vertical[this.curPos.x][this.curPos.y];
      case MoveDirection.Down:
        return this.vertical[this.curPos.x][this.curPos.y + 1];
      case MoveDirection.Right:
        return this.horizontal[this.curPos.x][this.curPos.y];
      case MoveDirection.Left:
        return this.horizontal[this.curPos.x - 1][this.curPos.y];
      case MoveDirection.UpRight:
        return this.slash[this.curPos.x][this.curPos.y];
      case MoveDirection.DownLeft:
        return this.slash[this.curPos.x - 1][this.curPos.y + 1];
      case MoveDirection.UpLeft:
        return this.backslash[this.curPos.x][this.curPos.y];
      case MoveDirection.DownRight:
        return this.backslash[this.curPos.x + 1][this.curPos.y + 1];
    }
    return false;
  }

  private directionToOffset(moveDirection: MoveDirection): Point {
    switch(moveDirection){
      case MoveDirection.Up:
        return {x: 0, y: -1};
      case MoveDirection.Down:
        return {x: 0, y: 1};
      case MoveDirection.Right:
        return {x: 1, y: 0};
      case MoveDirection.Left:
        return {x: -1, y: 0};
      case MoveDirection.UpRight:
        return {x: 1, y: -1};
      case MoveDirection.DownLeft:
        return {x: -1, y: 1};
      case MoveDirection.UpLeft:
        return {x: -1, y: -1};
      case MoveDirection.DownRight:
        return {x: 1, y: 1};
    }
  }

  private movePoint(xOffset: number, yOffset: number){
    this.curPos = {x: this.curPos.x + xOffset , y: this.curPos.y + yOffset }
    console.log('moved ', this.getCords())
  }

  private markEdge(moveDir: MoveDirection) {
    switch(moveDir){
      case MoveDirection.Up:
        this.vertical[this.curPos.x][this.curPos.y] = true;
        break;
      case MoveDirection.Down:
        this.vertical[this.curPos.x][this.curPos.y + 1] = true;
        break;
      case MoveDirection.Right:
        this.horizontal[this.curPos.x][this.curPos.y] = true;
        break;
      case MoveDirection.Left:
        this.horizontal[this.curPos.x - 1][this.curPos.y] = true;
        break;
      case MoveDirection.UpRight:
        this.slash[this.curPos.x][this.curPos.y] = true;
        break;
      case MoveDirection.DownLeft:
        this.slash[this.curPos.x - 1][this.curPos.y + 1] = true;
        break;
      case MoveDirection.UpLeft:
        this.backslash[this.curPos.x][this.curPos.y] = true;
        break;
      case MoveDirection.DownRight:
        this.backslash[this.curPos.x + 1][this.curPos.y + 1] = true;
        break;
    }
  }
}
