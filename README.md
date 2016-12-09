# Battleship Clone
Project for CIS 667 Intro to Artificial Intelligence

## Objective:
The objective of this project is to apply the Goal Based Agent approach to a simple game

## Try the app.

### Required Software
* [Git](https://git-scm.com/)
* [Node/NPM](https://nodejs.org/en/)

### Install Instruction
1. Clone the [Battleship repo](https://github.com/xian0831/CIS-664.git)
2. go to cloned project:
	linux/Mac: `cd CIS-664`
3. Run `npm install` in command line to get the required dependencies
4. Once you have that you can simply type `node game.js` in the command line to start the game.

### Game Presentation
```
Player's game board.
  |  0  |  1  |  2  |  3  |  4
--------------------------------
0 |  A  |  X  |  U  |  U  |  U
--------------------------------
1 |  O  |  A  |  U  |  U  |  U
--------------------------------
2 |  U  |  A  |  U  |  U  |  U
--------------------------------
3 |  U  |  A  |  U  |  U  |  U
--------------------------------
4 |  U  |  U  |  U  |  U  |  U
--------------------------------

A: the block that has a part of ship
U: the undiscovered block
O: the discovered block with no ship found
X: the discovered block with a part of ship

```


## Technology Used
Node.js

### Shortcoming
* The user is still allow to place ships on top of each other. The error checking has not been implemented
* There is no easy way to record game data. It is hard to benchmak the performance.
