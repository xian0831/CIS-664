var prompt = require('prompt');
var Ship = require('./Ship.js');


var Player = function() {
    this.life = 0;
    this.ships = [];
    this.board;
    this.discoveredShip =[];
    // this.AIboard = initGameBoard();
    this.setShip = function(size, orientation, location) {
        if(isPlacementValid(size, orientation, location, this.board)){
            this.ships.push(new Ship(size, orientation, location));
            this.life += size;
            placeShipsOnBoard(size, orientation, location, this.board);
            return true;
        } else {
            return false;
        }
    };

    function isPlacementValid(size, orientation, location, board){

        if (orientation === 'H' && size+location.x>4){
            return false;
        } else if (orientation === 'V' && size+location.y>4){
            return false;
        }

        if (orientation === 'H') {
            for (index = location.x; index < location.x + size; index++) {
                if(board[location.y][index] == 'A'){
                    return false;
                }
            }
        }  else {
            for (index = location.y; index < location.y + size; index++) {
                if (board[index][location.x] == 'A') {
                    return false
                }
            }
        }

        return true;
    }


    // TODO: 1.) check boundry
    function placeShipsOnBoard(size, orientation, location, board) {
        var index = 0;
        if (orientation === 'H') {
            for (index = location.x; index < location.x + size; index++) {
                board[location.y][index] = 'A';
            }
        } else {
            for (index = location.y; index < location.y + size; index++) {
                board[index][location.x] = 'A';
            }
        }
    }

}

// There will be 4 states for the game board.
// 'U' Unknown
// 'A' Assign
// 'X' Hit
// 'O' Miss
Player.prototype.initGameBoard = function() {
    function action() {
        var x = new Array(5).fill('U');
        for (var i = 0; i < 5; i++) {
            x[i] = new Array(5).fill('U');
        }

        return x;
    }

    this.board = action();
}

Player.prototype.printGameBoard = function() {
    var separator = Array(33).join('-');
    console.log([,0,1,2,3,4].join('  |  '));
    console.log(separator);
    var index = 0;
    for(item in this.board){
        console.log(index+" |  "+this.board[item].join('  |  '));
        index++;
        console.log(separator);
    }
}

Player.prototype.hit = function(x, y) {
    if (this.board[y][x] === 'A') {
        this.board[y][x] = 'X';
        this.discoveredShip.push([x,y]);
        this.life--;
        return true
    } else if (this.board[y][x] === 'U') {
        this.board[y][x] = 'O';
        return true;
    } else {
        return false;
    }
}

Player.prototype.smartChoice = function(){
    var x, y;
    for(key in this.discoveredShip){
        item = this.discoveredShip[key];
        x = item[0];
        y = item[1];
        if(y-1 >= 0 && this.board[y-1][x] != 'X' && this.board[y-1][x] != 'O'){
            return [x,y-1];
        } else if(x-1 >= 0 && this.board[y][x-1] != 'X' && this.board[y][x-1] != 'O') {
            return [x-1,y];
        } else if(x+1 < 5 && this.board[y][x+1] != 'X' && this.board[y][x+1] != 'O') {
            return [x+1,y];
        } else if(y+1 < 5 && this.board[y+1][x] != 'X' && this.board[y+1][x] != 'O') {
            return [x,y+1];
        }


    }
    return null;
}

Player.prototype.randomAssign = function() {
    function generate(obj,size){
        var X;
        var Y;
        var orientation;
        do {
            orientation = (Math.random() >= 0.5) ? 'H' : 'V';
            if (orientation === 'H') {
                X = Math.floor(Math.random() * 4);
            } else {
                X = Math.floor(Math.random() * 5);
            }

            if (orientation === 'V') {
                Y = Math.floor(Math.random() * 4);
            } else {
                Y = Math.floor(Math.random() * 5);
            }

        } while (!obj.setShip(size, orientation, {
            "x": X,
            "y": Y
        }));

        // Debug: setship parameters
        // console.log(orientation +' '+X+' '+Y);


    }

    // TODO: change from hard code to dynamic
    generate(this,2);
    generate(this,3);

}

Player.prototype.isDead = function () {
    if(this.life === 0) {
        return true;
    } else {
        false;
    }
};


function AI() {
    Player.call(this);
    this.AIboard;
}

AI.prototype = Object.create(Player.prototype);
AI.prototype.constructor = AI;
AI.prototype.initGameBoard = function() {

    this.board = action();
    this.AIboard = action();
    function action() {
        var x = new Array(5).fill('U');
        for (var i = 0; i < 5; i++) {
            x[i] = new Array(5).fill('U');
        }

        return x;
    }
}

AI.prototype.hit = function(x, y) {
    if (x > 4 || y > 4) {
        return false;
    }
    if (this.board[y][x] === 'A') {
        this.board[y][x] = 'X';
        this.AIboard[y][x] = 'X';
        this.life--;
        return true
    } else if (this.board[y][x] === 'U') {
        this.board[y][x] = 'O';
        this.AIboard[y][x] = 'O';
        return true;
    } else {
        return false;
    }
}

AI.prototype.printGameBoard = function() {
    var separator = Array(33).join('-');
    console.log([,0,1,2,3,4].join('  |  '));
    console.log(separator);
    var index = 0;
    for(item in this.board){
        console.log(index+" |  "+this.AIboard[item].join('  |  '));
        index++;
        console.log(separator);
    }
}



var app = function() {
    // input schema
    var xAxisSchema = {
        description: 'Please select the location on X axis? (0 - 4)',
        required: true,
        pattern: /^[0-4]$/,
        type: 'integer',
        message: 'X axis must be in the range of 0 - 4'
    }

    var yAxisSchema = {
        description: 'Please select the location on Y axis? (0 - 4)',
        required: true,
        pattern: /^[0-4]$/,
        type: 'integer',
        message: 'Y axis must be in the range of 0 - 4'
    }

    var orientationSchema = {
        description: 'How do you want to place your ship?  H(orizontal) or V(ertical) ',
        required: true,
        pattern: /^[HV]$/,
        type: 'string',
        message: 'Orientation must be either H(orizontal) or V(ertical)'
    }

    var schema = {
        properties: {
            X: xAxisSchema,
            Y: yAxisSchema,
            orientation: orientationSchema
        }

    }

    // Game
    // Init AI player
    var ai = new AI();
    ai.initGameBoard();
    ai.randomAssign.bind(ai)();


    // Init human player
    var human = new Player();
    human.initGameBoard();

    function placeUserShip() {
        console.log('Please place your first ship.');
        prompt.get(schema, function(err, result){
            human.setShip(2,result.orientation,{
                'x': result.X,
                'y': result.Y
            })
            console.log('Please place your second ship.');
            prompt.get(schema, function(err, result){

                human.setShip(3,result.orientation,{
                    'x': result.X,
                    'y': result.Y
                });
                console.log("Player's game board.");
                human.printGameBoard();

                ask();
            });

        });

    };
    placeUserShip();




    function ask() {
        console.log("\n\nPlayer move");
        // console.log(ai.AIboard);
        ai.printGameBoard();

        // Ask for name until user inputs "done"
        prompt.get({
            properties:{
                X: xAxisSchema,
                Y: yAxisSchema
            }
        }, function(err, result) {
            var smartChoice = null;
            // if the input is valid, check the game rule
            if (ai.hit(result.X, result.Y)) {
                // if the AI is dead. Player win.
                if(ai.isDead()){
                    console.log("Player win!\n\n");
                    return;
                }

                // CPU's turn
                console.log("CPU move\n\n");
                // Random hit
                smartChoice = human.smartChoice();
                if(smartChoice == null) {
                    do {
                        var hitOrMiss = human.hit(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
                    } while (!hitOrMiss);
                } else {
                    human.hit(smartChoice[0], smartChoice[1]);
                }

                human.printGameBoard();
                if(human.isDead()){
                    console.log("CPU win!!\n\n");
                }

                // ask for user input again
                ask();

            // if the user move is not valid
            // 1. a location has been selected in previous moves
            } else {
                console.log("Please select a valid move.");
                ask();
            }
        });
    }


    function randomPlaySimulator(human) {
        //random play
        var i = 0;
        while (human.life > 0) {
            var hitOrMiss = human.hit(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
            if (hitOrMiss) {
                i++;
                console.log(i);
                console.log(human.board);
            }
            if(human.isDead()){
                console.log("CPU win!!\n\n");
            }

        }
    }

    // randomPlaySimulator(human);


}

app();
// var human = new Player();
// human.initGameBoard();
// human.discoveredShip = [ [ 1, 1 ] ];
// console.log(human.smartChoice());
