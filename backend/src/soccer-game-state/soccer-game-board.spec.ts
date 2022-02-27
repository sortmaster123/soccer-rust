import { Test, TestingModule } from '@nestjs/testing';
import { GameBoard, MoveDirection, MoveResult } from './soccer-game-board';

describe('GameBoard', () => {
  let service: GameBoard;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [GameBoard],
    }).compile();

    service = app.get<GameBoard>(GameBoard);
  });

  describe('initialized game moves', () => {

    function assertPositionIs(x: number, y: number){
      let curPos = service.getCords();
      expect(curPos.x).toEqual(x);
      expect(curPos.y).toEqual(y);
    }

    beforeEach(() => service.initializeGame());

    it('should create"', () => {
      expect(service).toBeTruthy();
      assertPositionIs(5,5);
    });

    it('should be able to move up', () => {

      assertPositionIs(5, 5);
      let moveResult = service.move(MoveDirection.Up);
      expect(moveResult).toEqual(MoveResult.Moved);

      assertPositionIs(5, 4);
    });

    it('should not be able to move up and then down', () => {
      service.move(MoveDirection.Up);
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult).toEqual(MoveResult.AlreadyTaken);
      assertPositionIs(5, 4);
    });


    it('should not be able to move down and then up', () => {
      service.move(MoveDirection.Down);
      let moveResult = service.move(MoveDirection.Up);
      expect(moveResult).toEqual(MoveResult.AlreadyTaken);
      assertPositionIs(5, 6);
    });

    it('should be able to move down', () => {
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult).toEqual(MoveResult.Moved);
    });

    it('should not be able to move down and then up', () => {
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult).toEqual(MoveResult.Moved);
    });

    it('should be able to move down twice', () => {
      service.move(MoveDirection.Down);
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult).toEqual(MoveResult.Moved);
    });


    it('test left right movement', () => {
      expect(service.move(MoveDirection.Left)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.Right)).toEqual(MoveResult.AlreadyTaken);
    });

    it('test right left movement', () => {
      expect(service.move(MoveDirection.Right)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.Left)).toEqual(MoveResult.AlreadyTaken);
    });

    it('test slash up down movement', () => {
      expect(service.move(MoveDirection.UpRight)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.DownLeft)).toEqual(MoveResult.AlreadyTaken);
    });

    it('test slash down up movement', () => {
      expect(service.move(MoveDirection.DownLeft)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.UpRight)).toEqual(MoveResult.AlreadyTaken);
    });

    it('test backslash up down movement', () => {
      expect(service.move(MoveDirection.UpLeft)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.DownRight)).toEqual(MoveResult.AlreadyTaken);
    });

    it('test backslash down up movement', () => {
      expect(service.move(MoveDirection.DownRight)).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.UpLeft)).toEqual(MoveResult.AlreadyTaken);
    });
  });
});
