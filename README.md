This project will have an implementation of a common soccer game on paper. After that a computer AI will be implemented in order to facilitate single player game, as described in wikipedia:
https://en.wikipedia.org/wiki/Paper_soccer

The project will consist of a few programs:
1. Web app that will contain GUI.
2. Rust backend that will contain state of the game.
3. Program responsible for AI that will be communicating with 2.

Web app is going to have a simple frontend and will communicate with backend using web sockets. Formats of messages is to be decided. The frontend initially will be very simple it is not the most interesting part of this project. Web app will query the backend about legality of all moves and state of the game, probably no validation will be happening on frontend at least for now.
Web app will be written in vue.

Backend program will have to track state of the game. The operations that it needs to support:
- report state of the game (in progress, won by player 1, won by player 2, player 1 on the move, player 2 on the move)
- accept a move or sequence of moves and validate their legality. If they are legal they can be played.
The backend will be written in angular.