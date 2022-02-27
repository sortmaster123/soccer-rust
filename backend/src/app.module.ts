import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameBoard } from './soccer-game-state/soccer-game-board';
import { EventsGateway } from './websocket';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsGateway, GameBoard],
})
export class AppModule {}
