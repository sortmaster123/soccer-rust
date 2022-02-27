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
  AlreadyTaken,
  Moved,
}

export type MoveResponse = {
  moveResult: MoveResult
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
    this.curPos = {x: 5, y: 5};
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

  move(moveDir: MoveDirection): MoveResult {
    if(this.checkIfEdgeMarked(moveDir)){
      return MoveResult.AlreadyTaken;
    }

    this.markEdge(moveDir);
    
    switch(moveDir){
      case MoveDirection.Up:
        this.movePoint(0, -1)
        break;
      case MoveDirection.Down:
        this.movePoint(0, 1)
        break;
      case MoveDirection.Right:
        this.movePoint(1, 0)
        break;
      case MoveDirection.Left:
        this.movePoint(-1, 0)
        break;
      case MoveDirection.UpRight:
        this.movePoint(1, -1)
        break;
      case MoveDirection.DownLeft:
        this.movePoint(-1, 1);
        break;
      case MoveDirection.UpLeft:
        this.movePoint(-1, -1);
        break;
      case MoveDirection.DownRight:
        this.movePoint(1, 1);
        break;
    }

    return MoveResult.Moved;
  }

  getCords(): Point{
    return {...this.curPos};
  }

  private checkIfEdgeMarked(moveDir: MoveDirection): boolean {
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
