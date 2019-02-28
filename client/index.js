const io = require('socket.io-client');
const lodash = require('lodash');
const boardRenderer = require('./boardRenderer').boardRenderer;

// First 2 args are the path to the node executable and the file you are executing
const args = process.argv.slice(2);
// Why choose 3360? I liked that it was the mysql port a bit mixed up :-)
const serverURL = args[0] ? `${args[0]}:3360` : 'http://localhost:3360';


console.log(`Initiating socket connection to ${serverURL}`);

const socket = io(serverURL);
let playerDetails = {};

socket.on('initGame', (msg) => {
    if (msg.newPlayerAllowed) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question(`Please enter your name\n`, (nameOfPlayer) => {
            socket.emit('registerPlayer', {playerName: nameOfPlayer});
            readline.close()
        });
    } else {
        console.log('Game full sorry');
        process.exit();
    }
});

socket.on('registeredPlayer', (playerInfo) => {
    console.log(`Good luck ${playerInfo.playerName}`);
    playerDetails = playerInfo;
});

socket.on('gamestate', ({currentPlayers, boardState, winner}) => {
    // get the current state of the board
    if (currentPlayers.player2.id != undefined) {
        boardRenderer.render(boardState);
        if (!lodash.isUndefined(winner)) {
            console.log('We have a winner');
            return;
        }

        if (playerDetails.playerId === 1 ) {
            if (currentPlayers.player1.nextMove) {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                readline.question(`It's your turn ${playerDetails.playerName}, please enter column (1-9)\n`, (column) => {
                    socket.emit('makeMove', {playerId: 1, columnId: column});
                    readline.close()
                });
            } else {
                console.log(`Waiting for ${currentPlayers.player2.playerName} to make a move`);
            }
        } else {
            if (currentPlayers.player2.nextMove) {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                readline.question(`Its your turn ${playerDetails.playerName}, please enter column (1-9)\n`, (column) => {
                    socket.emit('makeMove', {playerId: 2, columnId: column});
                    readline.close()
                });
            } else {
                console.log(`Waiting for ${currentPlayers.player1.playerName} to make a move`);
            }
        }
    } else {
        console.log('Waiting for another player');
        return;
    }
});

socket.on('disconnect', () => {
    console.log('Connection with server lost, sorry but I must exit, you probably would have won...');
    process.exit();
});

