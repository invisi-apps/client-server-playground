const lodash = require('lodash');
const events = {};
const boardState = {
    '0': ['','','','','',''],
    '1': ['','','','','',''],
    '2': ['','','','','',''],
    '3': ['','','','','',''],
    '4': ['','','','','',''],
    '5': ['','','','','',''],
    '6': ['','','','','',''],
    '7': ['','','','','',''],
    '8': ['','','','','','']
};

const addEvent =(name) => {
    if (typeof events[`${name}`] === "undefined") {
        events[`${name}`] = [];
    }
};

const register = (event, subscriber) => {
    if (typeof subscriber === "object" && typeof subscriber.notify === 'function') {
        console.log('adding subscriber');
        addEvent(event);
        events[`${event}`].push(subscriber);
    }
};

const notify = (event, data) => {
    let notifyEvents = events[`${event}`];
    for (let e in notifyEvents) {
        console.log('notifyinga subscriber');
        notifyEvents[e].notify(data);
    }
};

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
                id: 2,
                nextMove: false
            };
            currentPlayers.player1.nextMove = true;
            return currentPlayers.player2;
        }
    }
};

const makeMove = ({playerId, columnId}) => {
    let valToMark = 'o';
    if (playerId === 1) {
        valToMark = 'x';
        currentPlayers.player1.nextMove = false;
        currentPlayers.player2.nextMove = true;
    } else {
        currentPlayers.player1.nextMove = true;
        currentPlayers.player2.nextMove = false;
    }

    const columnIndex = columnId -1;
    for (let downIndex = 5; downIndex > -1; downIndex--) {
            const value = boardState[`${columnIndex}`][downIndex];
            if (lodash.isEmpty(value)) {
                boardState[`${columnIndex}`][downIndex] = valToMark;
                break;
            }
    }
    notify('change', {});
};

const notifyAll = () => {
    notify('change',{});
};

exports.gameState = {
    newPlayersAllowed,
    setNewPlayerName,
    makeMove,
    register,
    notifyAll,
    boardState,
    currentPlayers
};