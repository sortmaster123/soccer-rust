import { Test, TestingModule } from '@nestjs/testing';
import { GameBoard, GameState, MoveDirection, MoveResult } from './soccer-game-board';

describe('GameBoard', () => {
  let service: GameBoard;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [GameBoard],
    }).compile();

    service = app.get<GameBoard>(GameBoard);
  });

  describe('game state', () => {
    beforeEach(() => service.initializeGame());

    it('should declare a P1 win', () => {
      for(let i = 0; i < 5; i ++){
        expect(service.move(MoveDirection.Up)).toEqual({moveResult: MoveResult.Moved, gameState: GameState.ContinueMove });
      }

      let result = service.move(MoveDirection.Up);
      expect(result).toEqual({
          moveResult: MoveResult.Moved,
          gameState: GameState.P1Win,
        });
      assertPositionIs(5, 0);
    })

    it('should declare a P2 win', () => {
      for(let i = 0; i < 5; i ++){
        expect(service.move(MoveDirection.Down)).toEqual({moveResult: MoveResult.Moved, gameState: GameState.ContinueMove });
      }

      let result = service.move(MoveDirection.Down);
      assertPositionIs(5, 12);
      expect(result).toEqual({
          moveResult: MoveResult.Moved,
          gameState: GameState.P2Win,
        });
      
    })
  })

  describe('move validity', () => {

    beforeEach(() => service.initializeGame());

    it('should create"', () => {
      expect(service).toBeTruthy();
      assertPositionIs(5, 6);
    });

    it('should be able to move up', () => {

      assertPositionIs(5, 6);
      let moveResult = service.move(MoveDirection.Up);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);

      assertPositionIs(5, 5);
    });

    it('should not be able to move up and then down', () => {
      service.move(MoveDirection.Up);
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.AlreadyTaken);
      assertPositionIs(5, 5);
    });


    it('should not be able to move down and then up', () => {
      service.move(MoveDirection.Down);
      let moveResult = service.move(MoveDirection.Up);
      expect(moveResult.moveResult).toEqual(MoveResult.AlreadyTaken);
      assertPositionIs(5, 7);
    });

    it('should be able to move down', () => {
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);
    });

    it('should not be able to move down and then up', () => {
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);
    });

    it('should be able to move down twice', () => {
      service.move(MoveDirection.Down);
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);
    });


    it('test left right movement', () => {
      expect(service.move(MoveDirection.Left).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.Right).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('test right left movement', () => {
      expect(service.move(MoveDirection.Right).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.Left).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('test slash up down movement', () => {
      expect(service.move(MoveDirection.UpRight).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.DownLeft).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('test slash down up movement', () => {
      expect(service.move(MoveDirection.DownLeft).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.UpRight).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('test backslash up down movement', () => {
      expect(service.move(MoveDirection.UpLeft).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.DownRight).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('test backslash down up movement', () => {
      expect(service.move(MoveDirection.DownRight).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(MoveDirection.UpLeft).moveResult).toEqual(MoveResult.AlreadyTaken);
    });
  });

  function assertPositionIs(x: number, y: number){
    let curPos = service.getCords();
    expect(curPos.x).toEqual(x);
    expect(curPos.y).toEqual(y);
  }
});
