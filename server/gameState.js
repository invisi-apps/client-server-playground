const lodash = require('lodash');

const currentPlayers = {
    player1: {},
    player2: {}
};

const newPlayersAllowed = () => {
    return lodash.isEmpty(currentPlayers.player1) || lodash.isEmpty(currentPlayers.player2);
};

const setNewPlayerName = (name) => {
    if (newPlayersAllowed()) {
        if (lodash.isEmpty(currentPlayers.player1)) {
            currentPlayers.player1 = {
                playerName: name,
                id: 1
            };
            return currentPlayers.player1;
        } else {
            currentPlayers.player2 = {
                playerName: name,
                id: 2
            };
            return currentPlayers.player2;
        }
    }
};


exports.gameState = {
    newPlayersAllowed,
    setNewPlayerName
};