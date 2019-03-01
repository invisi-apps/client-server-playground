const _ = require('lodash');


const getWinState = (currentPlayers) => {
    for (let playerAttribute in _.keys(currentPlayers)) {
        const player = _.values(currentPlayers)[playerAttribute];
        if (player.isWinner) {
            return {
                message: `We have a winner!\nCongratulations ${player.playerName}`
            }
        }
    }
    return undefined;
};

const getPlayerWhoseMoveIsNext = (currentPlayers) => {
    for (let playerAttribute in _.keys(currentPlayers)) {
        const player = _.values(currentPlayers)[playerAttribute];
        if (player.nextMove === true) {
            return player;
        }
    }
};

exports.gameLogic = {
    getWinState,
    getPlayerWhoseMoveIsNext
};