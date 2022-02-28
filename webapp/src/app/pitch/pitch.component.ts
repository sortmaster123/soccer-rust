import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { CanvasHelperService } from '../canvas-helper.service';
import { SocketService } from '../socket.service';
import { DrawMove, InitializeGame } from '../store/game-state.actions';

export type Point = {
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

@Component({
  selector: 'app-pitch',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.scss'],
})
export class PitchComponent implements AfterViewInit {
  @ViewChild('myCanvas')
  private myCanvas: ElementRef = {} as ElementRef;

  private initialized = false;
  private currentPoint: Point = {x: 4, y: 6};
  private canvasHelper?: CanvasHelperService = undefined;

  constructor(
    private readonly socketService: SocketService,
    private readonly store: Store,
    private readonly actions$: Actions,
  ) {
    this.store.dispatch(new InitializeGame()).subscribe();
    this.actions$
      .pipe(
        ofActionSuccessful(DrawMove),
        tap(move => this.moveDirection((move as DrawMove).moveDirection))
      )
      .subscribe();
  }

  private keyToAction(key: string): MoveDirection | undefined {
    switch(key) {
      case 'ArrowDown':
        return MoveDirection.Down;
      case 'ArrowUp':
        return MoveDirection.Up;
      case 'ArrowLeft':
        return MoveDirection.Left;
      case 'ArrowRight':
        return MoveDirection.Right;
      case 'PageDown':
        return MoveDirection.DownRight;
      case 'PageUp':
        return MoveDirection.UpRight;
      case 'End':
        return MoveDirection.DownLeft;
      case 'Home':
        return MoveDirection.UpLeft;
    }
    return undefined;
  }

  private moveDirection(moveDirection: MoveDirection) {
    console.log('moving in direction', moveDirection)
    this.markAMove(moveDirection);
    this.getCtx().stroke()
  }

  private markAMove(moveDirection: MoveDirection): boolean {
    switch(moveDirection) {
      case MoveDirection.Down:
        return this.move(0, 1);
      case MoveDirection.Up:
        return this.move(0, -1);
      case MoveDirection.Left:
        return this.move(-1, 0);
      case MoveDirection.Right:
        return this.move(1, 0);
      case MoveDirection.DownRight:
        return this.move(1, 1);
      case MoveDirection.UpRight:
        return this.move(1, -1);
      case MoveDirection.DownLeft:
        return this.move(-1, 1);
      case MoveDirection.UpLeft:
        return this.move(-1, -1);
    }
  }

  ngAfterViewInit(): void {
    if(!this.initialized){
      this.initializeHelper();
      this.canvasHelper?.configureCanvas();

      this.canvasHelper?.drawGridPoints();
      this.canvasHelper?.drawPitchBorders();

      this.getCtx().stroke();
      this.getCtx().stroke();

      this.initialized = true;
    }

    this.socketService.connect();
    this.socketService.requestNewGame();
  }

  // TODO: move to main component and process in store
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let action = this.keyToAction(event.key);
    if(action == undefined){
      return;
    }
    this.checkIfMoveIsLegal(action);
  }

  private move(xOffset: number, yOffset: number): boolean{
    this.canvasHelper?.drawLine(this.currentPoint.x, this.currentPoint.y, this.currentPoint.x+ xOffset, this.currentPoint.y + yOffset);
    this.currentPoint = {x: this.currentPoint.x + xOffset, y: this.currentPoint.y + yOffset};
    return true;
  }

  private checkIfMoveIsLegal(moveDir: MoveDirection){
    this.socketService.tryMove(moveDir);
  }

  private initializeHelper(){
    this.canvasHelper = new CanvasHelperService(this.myCanvas.nativeElement.getContext("2d"));
  }

  private getCtx(): CanvasRenderingContext2D {
    return this.myCanvas.nativeElement.getContext("2d");
  }
}
