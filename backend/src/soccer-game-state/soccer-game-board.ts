import {MoveResponse, MoveDirection, MoveResult} from '../models/models';

type Point = {
  x: number;
  y: number;
}

type EdgeLocation = {
  edgesArray: boolean[][];
  x: number;
  y: number;
}

export class GameBoard {

  private boardSizeX = 13;
  private boardSizeY = 9;
  private curPos: Point;

  private playerOnTheMove: 'P1OnTheMove' | 'P2OnTheMove' = 'P1OnTheMove';

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
    this.drawBorders();
  }

  getPlayerOnTheMove(){
    return this.playerOnTheMove;
  }

  private isPointPreviouslyVisited(): boolean {
    let directions = [
      MoveDirection.Down,
      MoveDirection.DownLeft,
      MoveDirection.Left,
      MoveDirection.UpLeft,
      MoveDirection.Up,
      MoveDirection.UpRight,
      MoveDirection.Right,
      MoveDirection.DownRight,
    ];

    let markedEdgesSum = 0;
    for(let direction of directions){
      if(this.isEdgeMarked(this.getEdgeLocationFromCurrentPoint(direction))){
        markedEdgesSum += 1;
        if(markedEdgesSum > 1){
          return true
        }
      }
    }

    return false
  }

  private flipPlayer(){
    this.playerOnTheMove = this.playerOnTheMove == 'P1OnTheMove' ? 'P2OnTheMove' : 'P1OnTheMove'
  }

  move(moveDir: MoveDirection): MoveResponse {
    let legality = this.isMoveInBounds(moveDir)
    if(legality != undefined){
      return legality;
    }

    let edge = this.getEdgeLocationFromCurrentPoint(moveDir);
    if(this.isEdgeMarked(edge)){
      return {
        moveResult: MoveResult.AlreadyTaken,
        gameState: this.getPlayerOnTheMove(),
      };
    }
    this.markEdge(edge)
    
    let offsets = this.directionToOffset(moveDir);
    this.movePoint(offsets.x, offsets.y);

    let hasWin = this.checkForWin();
    if(hasWin != undefined){
      return hasWin;
    }

    if(!this.isPointPreviouslyVisited()){
      this.flipPlayer()
    }

    return {
      moveResult: MoveResult.Moved,
      gameState: this.getPlayerOnTheMove(),
    };
  }

  private isMoveInBounds(moveDir: MoveDirection): MoveResponse | undefined {
    let curPoint = this.getCords()
    let offset = this.directionToOffset(moveDir)
    let newPoint = {
      x: curPoint.x + offset.x,
      y: curPoint.y + offset.y
    }

    if(newPoint.x > 9 || newPoint.x < 1){
      return {
        moveResult: MoveResult.InvalidMove,
        gameState: this.getPlayerOnTheMove(),
      }
    }

    if((newPoint.y < 1 || newPoint.y > 11) && newPoint.x != 4 && newPoint.x != 5 && newPoint.x !== 6){
      return {
        moveResult: MoveResult.InvalidMove,
        gameState: this.getPlayerOnTheMove(),
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
        gameState: 'P1Win',
      }
    }

    if(curPos.y == 12){
      return {
        moveResult: MoveResult.Moved,
        gameState: 'P2Win',
      }
    }
    return undefined;
  }

  getCords(): Point{
    return {...this.curPos};
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
  }

  private isEdgeMarked(edgeLocation: EdgeLocation): boolean {
    return edgeLocation.edgesArray[edgeLocation.x][edgeLocation.y];
  }

  private markEdge(edgeLocation: EdgeLocation) {
    edgeLocation.edgesArray[edgeLocation.x][edgeLocation.y] = true;
  }

  private getEdgeLocationFromCurrentPoint(moveDirection: MoveDirection): EdgeLocation {
    return this.getEdgeLocation(this.getCords(), moveDirection);
  }

  private getEdgeLocation(startingPoint: Point, moveDirection: MoveDirection): EdgeLocation {
    switch(moveDirection){
      case MoveDirection.Up:
        return {
          edgesArray: this.vertical,
          x: startingPoint.x,
          y: startingPoint.y,
        };
      case MoveDirection.Down:
        return {
          edgesArray: this.vertical,
          x: startingPoint.x,
          y: startingPoint.y + 1,
        };
      case MoveDirection.Right:
        return {
          edgesArray: this.horizontal,
          x: startingPoint.x,
          y: startingPoint.y,
        };
      case MoveDirection.Left:
        return {
          edgesArray: this.horizontal,
          x: startingPoint.x - 1,
          y: startingPoint.y,
        };
      case MoveDirection.UpRight:
        return {
          edgesArray: this.slash,
          x: startingPoint.x,
          y: startingPoint.y,
        };
      case MoveDirection.DownLeft:
        return {
          edgesArray: this.slash,
          x: startingPoint.x - 1,
          y: startingPoint.y + 1,
        };
      case MoveDirection.UpLeft:
        return {
          edgesArray: this.backslash,
          x: startingPoint.x,
          y: startingPoint.y,
        };
      case MoveDirection.DownRight:
        return {
          edgesArray: this.backslash,
          x: startingPoint.x + 1,
          y: startingPoint.y + 1,
        };
    }
  }

  private drawBorders(){
    for(let i = 11; i > 0; i--){
      // side borders
      this.markEdge(this.getEdgeLocation({x: 1, y: i}, MoveDirection.Up))
      this.markEdge(this.getEdgeLocation({x: 9, y: i}, MoveDirection.Up))
    }

    for(let i = 1; i < 4; i++){
      // top and down left borders
      this.markEdge(this.getEdgeLocation({x: i, y: 11}, MoveDirection.Right))
      this.markEdge(this.getEdgeLocation({x: i, y: 1}, MoveDirection.Right))
    }

    for(let i = 6; i < 9; i++){
      // top and down right borders
      this.markEdge(this.getEdgeLocation({x: i, y: 11}, MoveDirection.Right))
      this.markEdge(this.getEdgeLocation({x: i, y: 1}, MoveDirection.Right))
    }

    //goal borders
    this.markEdge(this.getEdgeLocation({x: 4, y: 11}, MoveDirection.Down))
    this.markEdge(this.getEdgeLocation({x: 6, y: 11}, MoveDirection.Down))
    this.markEdge(this.getEdgeLocation({x: 4, y: 1}, MoveDirection.Up))
    this.markEdge(this.getEdgeLocation({x: 6, y: 1}, MoveDirection.Up))
  }
}
