const io = require('socket.io-client');
const _ = require('lodash');
const userInput = require('./userInput').userInput;
const boardRenderer = require('./boardRenderer').boardRenderer;
const gameLogic = require('./gameLogic').gameLogic;

// First 2 args are the path to the node executable and the file you are executing
const args = process.argv.slice(2);
let serverURL = (!_.isUndefined(args[0]) && !_.startsWith(args[0], './'))
    ? `http://${args[0]}:` : 'http://localhost:';

serverURL = _.isNumber(args[1]) ? serverURL += args[1] : serverURL += '3360';

console.log(`Initiating socket connection to ${serverURL}`);

let playerDetails = {};
const socket = io(serverURL);

socket.on('initGame', (msg) => {
    if (msg.newPlayerAllowed) {
        const response = (playerName) => {
            socket.emit('registerPlayer', {playerName});
        };
        userInput.askQuestion('Please enter your name', response);
    } else {
        console.log('Game full sorry');
        process.exit();
    }
});

socket.on('registeredPlayer', (playerInfo) => {
    console.log(`Good luck ${playerInfo.playerName}`);
    playerDetails = playerInfo;
});

socket.on('gamestate', ({currentPlayers, boardState}) => {
    // We have a second player - game is active
    if (!_.isUndefined(currentPlayers.player2.id)) {
        boardRenderer.render(boardState);

        const winState = gameLogic.getWinState(currentPlayers);
        if (!_.isUndefined(winState)) {
            console.log(winState.message);
            return;
        }

        const playerNextMove = gameLogic.getPlayerWhoseMoveIsNext(currentPlayers);
        if (playerDetails.playerId === playerNextMove.id) {
            const questionResponse = (column) => {
                socket.emit('makeMove', {playerId: playerDetails.playerId, columnId: column});
            };
            userInput.askQuestion(`It's your turn ${playerDetails.playerName}, please enter column (1-9)`, questionResponse);
        } else {
            console.log(`Waiting for ${playerNextMove.playerName} to make a move`);
        }
    } else {
        console.log('Waiting for another player');
        return;
    }
});

socket.on('disconnect', () => {
    console.log('Connection with server lost');
    process.exit();
});

