import { Direction } from "readline";

type Point = {
  x: number;
  y: number;
}

export enum MoveDirection {
  Up, Down, Left, Right, UpLeft, UpRight, DownLeft, DownRight
}

export enum MoveResult {
  AlreadyTaken,
  Moved,
}

export class GameBoard {

  private boardSizeX = 13;
  private boardSizeY = 9;
  private curPos: Point;

  private vertical: boolean[][];
  private horizontal: boolean[][];

  constructor() { this.initializeGame() }

  initializeGame(){
    this.curPos = {x: 5, y: 5};
    this.vertical = [];
    this.horizontal = [];
    for(let i = 0; i < this.boardSizeX; i++){
      this.vertical[i] = []
      this.horizontal[i] = []
      for(let j = 0; j < this.boardSizeY; j++){
        this.vertical[i][j] = false
        this.horizontal[i][j] = false
      }
    }
  }

  move(moveDir: MoveDirection): MoveResult{
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
    }
  }
}
