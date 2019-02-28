const io = require('socket.io-client');

// First 2 args are the path to the node executable and the file you are executing
const args = process.argv.slice(2);
// Why choose 3360? I liked that it was the mysql port a bit mixed up :-)
const serverURL = args[0] ? `${args[0]}:3360` : 'http://localhost:3360';


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log(`Initiating socket connection to ${serverURL}`);

const socket = io(serverURL);
let playerDetails = {};

socket.on('initGame', (msg) => {
    if (msg.newPlayerAllowed) {
        readline.question(`What's your name?`, (nameOfPlayer) => {
            socket.emit('registerPlayer', {playerName: nameOfPlayer});
            console.log(`registering ${nameOfPlayer}`);
            readline.close()
        });
    } else {
        console.log('game full sorry');
        process.exit();
    }
});

socket.on('registeredPlayer', (playerInfo) => {
    console.log(`Player accepted. Name: ${playerInfo.playerName}, ID: ${playerInfo.playerId}`);
    playerDetails = playerInfo;
});

socket.on('gamestate', (gameState) => {

});

socket.on('disconnect', () => {
    console.log('Connection with server lost, sorry but I must exit, you probably would have won...');
    process.exit();
});

