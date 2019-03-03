const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const gameState = require('./gameState').gameState;


/*-------------------- Game logic ------------------------*/

// Listen for new connections
io.on('connection', function (socket) {
    if (gameState.newPlayersAllowed()) {
        // Send an init message to the new client
        socket.emit('initGame', {newPlayerAllowed: true});

        // Listen for the player registered msg
        socket.on('registerPlayer', (msg) => {
            // Add player to the game - note no duplicate name checks - ids and x or o will let users understand
            const playerDetails = gameState.setNewPlayerName(msg.playerName);

            console.log(`Player accepted. Name: ${playerDetails.playerName}, ID: ${playerDetails.id}`);
            // Send identification details to the client
            socket.emit('registeredPlayer', {playerName: playerDetails.playerName, playerId: playerDetails.id});

            // Configure the observer to notify the clients with the current game state
            const respondToChange = {
                notify: () => {
                    socket.emit('gamestate', {
                        boardState: gameState.boardState,
                        currentPlayers: gameState.currentPlayers
                    });
                }
            };

            // Register observer for the gamestate
            gameState.register('change', respondToChange);

            // Fire a gamestate change to initialise clients
            gameState.notifyAll();
        });

        // Listen for the game events
        socket.on('makeMove', (moveObj) => {
            gameState.makeMove(moveObj);
        });

        // Listen for the disconnects to halt the game
        socket.on('disconnect', () => {
            console.log(`Player disconnected - game over`);
            process.exit();
        });

    } else {
        // Inform the client that the game is not accepting players
        socket.emit('initGame', {newPlayerAllowed: false});
    }
});

/*-------------------- Server Setup ------------------------*/

// First 2 args are the path to the node executable and the file you are executing
const args = process.argv.slice(2);
const portToListenOn = args[0] ? args[0] : 3360;


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log(`Server address: ${add}:${portToListenOn}`);
});

http.listen(portToListenOn, function () {
    console.log(`listening on *:${portToListenOn}`);
});