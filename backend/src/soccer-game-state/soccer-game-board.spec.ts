import { Test, TestingModule } from '@nestjs/testing';
import { GameBoard, GameResult, MoveDirection, MoveResult } from './soccer-game-board';

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

    it.each([
      [ MoveDirection.UpLeft, 4, 0 ],
      [ MoveDirection.Up, 5, 0 ],
      [ MoveDirection.UpRight, 6, 0 ],
    ])
    ('should return p1 win for finishing with %s in (%d,%d)', (moveDirection, resultX, resultY) => {
      for(let i = 0; i < 5; i ++){
        expect(service.move(MoveDirection.Up)).toEqual({moveResult: MoveResult.Moved, gameState: GameResult.ContinueMove });
      }

      let result = service.move(moveDirection);
      assertPositionIs(resultX, resultY);
      expect(result).toEqual({
          moveResult: MoveResult.Moved,
          gameState: GameResult.P1Win,
      });
    });

    it.each([
      [ MoveDirection.DownLeft, 4, 12 ],
      [ MoveDirection.Down, 5, 12 ],
      [ MoveDirection.DownRight, 6, 12 ],
    ])
    ('should return p2 win for finishing with %s in (%d,%d)', (moveDirection, resultX, resultY) => {
      for(let i = 0; i < 5; i ++){
        expect(service.move(MoveDirection.Down)).toEqual({moveResult: MoveResult.Moved, gameState: GameResult.ContinueMove });
      }

      let result = service.move(moveDirection);
      assertPositionIs(resultX, resultY);
      expect(result).toEqual({
          moveResult: MoveResult.Moved,
          gameState: GameResult.P2Win,
      });
    });
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

    it.each([
      [ MoveDirection.Up, MoveDirection.Down ],
      [ MoveDirection.Down, MoveDirection.Up ],
      [ MoveDirection.Left, MoveDirection.Right ],
      [ MoveDirection.Right, MoveDirection.Left ],
      [ MoveDirection.UpLeft, MoveDirection.DownRight ],
      [ MoveDirection.DownRight, MoveDirection.UpLeft ],
      [ MoveDirection.UpRight, MoveDirection.DownLeft ],
      [ MoveDirection.DownLeft, MoveDirection.UpRight ],
    ])
    ('should not allow series of moves %s, %s', (move1Direction, move2Direction) => {
      expect(service.move(move1Direction).moveResult).toEqual(MoveResult.Moved);
      expect(service.move(move2Direction).moveResult).toEqual(MoveResult.AlreadyTaken);
    });

    it('should be able to move down', () => {
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);
    });

    it('should be able to move down twice', () => {
      service.move(MoveDirection.Down);
      let moveResult = service.move(MoveDirection.Down);
      expect(moveResult.moveResult).toEqual(MoveResult.Moved);
    });
  });

  describe('boundary safety', () => {
    beforeEach(() => service.initializeGame())

    it('should not allow going out of bounds to the right', () => {
      service.move(MoveDirection.Right);
      service.move(MoveDirection.Right);
      service.move(MoveDirection.Right);
      service.move(MoveDirection.Right);
      assertPositionIs(9, 6);

      expect(service.move(MoveDirection.Right)).toEqual({
        gameState: GameResult.ContinueMove,
        moveResult: MoveResult.InvalidMove,
      });
      assertPositionIs(9, 6);
    })

    it('should not allow going out of bounds to the left', () => {
      service.move(MoveDirection.Left);
      service.move(MoveDirection.Left);
      service.move(MoveDirection.Left);
      service.move(MoveDirection.Left);
      assertPositionIs(1, 6);

      expect(service.move(MoveDirection.Left)).toEqual({
        gameState: GameResult.ContinueMove,
        moveResult: MoveResult.InvalidMove,
      });
      assertPositionIs(1, 6);
    })
  })

  function assertPositionIs(x: number, y: number){
    let curPos = service.getCords();
    expect(curPos.x).toEqual(x);
    expect(curPos.y).toEqual(y);
  }
});
