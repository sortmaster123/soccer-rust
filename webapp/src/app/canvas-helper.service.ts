import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasHelperService {

  constructor(private ctx: CanvasRenderingContext2D) { }

  private pitchHeight = 13;
  private pitchWidth = 9;
  private lineLength = 10;
  private margin = 25;

  public configureCanvas(){
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
  }

  public drawPoint(x: number, y: number){
    this.ctx.fillRect(x, y, 1, 1);
  }

  public drawPitchBorders() {
    this.drawLine(0,1,3,1);
    this.drawLine(3,1,3,0);
    this.drawLine(5,1,5,0);
    this.drawLine(5,1,8,1);

    this.drawLine(8,1,8,11);
    this.drawLine(0,1,0,11);

    this.drawLine(0,11,3,11);
    this.drawLine(3,11,3,12);
    this.drawLine(5,11,5,12);
    this.drawLine(5,11,8,11);
  }

  public drawLine(xBegin: number, yBegin: number, xEnd: number, yEnd: number){
    this.ctx.moveTo(this.xToCordinate(xBegin), this.yToCordinate(yBegin));
    this.ctx.lineTo(this.xToCordinate(xEnd), this.yToCordinate(yEnd));
  }

  public drawGridPoints(){
    for(let i = 0; i < this.pitchWidth; i++){
      for(let j = 0; j < this.pitchHeight; j++){
        this.drawPoint(this.xToCordinate(i), this.yToCordinate(j));
      }
    }
  }

  private xToCordinate(x: number): number {
    return this.margin + x * this.lineLength
  }

  private yToCordinate(y: number): number {
    return this.margin + y * this.lineLength
  }
}
