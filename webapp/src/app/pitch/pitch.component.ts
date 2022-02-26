import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CanvasHelperService } from '../canvas-helper.service';

type Point = {
  x: number;
  y: number;
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
  private currentPoint: Point = {x: 4, y: 5};
  private canvasHelper?: CanvasHelperService = undefined;

  constructor() {}

  private moveKey(key: string): boolean {
    switch(key) {
      case 'ArrowDown':
        return this.move(0, 1);
      case 'ArrowUp':
        return this.move(0, -1);
      case 'ArrowLeft':
        return this.move(-1, 0);
      case 'ArrowRight':
        return this.move(1, 0);
      case 'PageDown':
        return this.move(1, 1);
      case 'PageUp':
        return this.move(1, -1);
      case 'End':
        return this.move(-1, 1);
      case 'Home':
        return this.move(-1, -1);
    }
    return false;
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
  }

  // TODO: move to main component and process in store
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.moveKey(event.key)

    // FIXME: making stroke once draws half translucent lines- to be fixed by configuring drawing properly.
    this.getCtx().stroke()
    this.getCtx().stroke()
  }

  private move(xOffset: number, yOffset: number): boolean{
    this.canvasHelper?.drawLine(this.currentPoint.x, this.currentPoint.y, this.currentPoint.x+ xOffset, this.currentPoint.y + yOffset);
    this.currentPoint = {x: this.currentPoint.x + xOffset, y: this.currentPoint.y + yOffset};
    return true;
  }

  private initializeHelper(){
    this.canvasHelper = new CanvasHelperService(this.myCanvas.nativeElement.getContext("2d"));
  }

  private getCtx(): CanvasRenderingContext2D {
    return this.myCanvas.nativeElement.getContext("2d");
  }
}
