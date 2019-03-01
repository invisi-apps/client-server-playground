const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const gameState = require('./gameState').gameState;


// First 2 args are the path to the node executable and the file you are executing
const args = process.argv.slice(2);


io.on('connection', function (socket) {
    if (gameState.newPlayersAllowed()) {
        socket.emit('initGame', {newPlayerAllowed: true});

        socket.on('registerPlayer', (msg) => {
            const playerDetails = gameState.setNewPlayerName(msg.playerName);
            console.log(`Player accepted. Name: ${playerDetails.playerName}, ID: ${playerDetails.id}`);
            socket.emit('registeredPlayer', {playerName: playerDetails.playerName, playerId: playerDetails.id});
            const respondToChange = {
                notify: () => {
                    socket.emit('gamestate', {
                        boardState: gameState.boardState,
                        currentPlayers: gameState.currentPlayers
                    });
                }
            };
            gameState.register('change', respondToChange);
            gameState.notifyAll();
        });

        socket.on('makeMove', (moveObj) => {
            gameState.makeMove(moveObj);
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected - game over`);
            process.exit();
        });

    } else {
        socket.emit('initGame', {newPlayerAllowed: false});
    }
});

const portToListenOn = args[0] ? args[0] : 3360;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log(`Server address: ${add}:${portToListenOn}`);
});

http.listen(portToListenOn, function () {
    console.log(`listening on *:${portToListenOn}`);
});