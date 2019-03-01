const _ = require('lodash');
const events = {};
const boardState = {
    '0': ['', '', '', '', '', ''],
    '1': ['', '', '', '', '', ''],
    '2': ['', '', '', '', '', ''],
    '3': ['', '', '', '', '', ''],
    '4': ['', '', '', '', '', ''],
    '5': ['', '', '', '', '', ''],
    '6': ['', '', '', '', '', ''],
    '7': ['', '', '', '', '', ''],
    '8': ['', '', '', '', '', '']
};

const checkHorizontal = () => {
    for (let downIndex = 5; downIndex > -1; downIndex--) {
        let currentVal = '';
        let countCurrentVal = 0;
        // this is wastefull as it will keep going to the top even if it knows there cant be any more
        for (let acrossIndex = 0; acrossIndex < 9; acrossIndex++) {
            const value = boardState[`${acrossIndex}`][downIndex];
            if (_.isEmpty(value)) {
                currentVal = '';
                countCurrentVal = 0;
            } else {
                if (currentVal === value) {
                    countCurrentVal++;
                } else {
                    currentVal = value;
                    countCurrentVal = 1;
                }

                if (countCurrentVal > 4) {
                    setWinner(currentVal);
                    return;
                }

            }
        }
    }
};

const checkVertical = () => {
    for (let acrossIndex = 0; acrossIndex < 9; acrossIndex++) {
        let currentVal = '';
        let countCurrentVal = 0;
        for (let downIndex = 5; downIndex > -1; downIndex--) {
            const value = boardState[`${acrossIndex}`][downIndex];
            if (_.isEmpty(value)) {
                // we start checking at the bottom
                //if there are no more above then we can short circuit this column
                continue;
            } else {
                if (currentVal === value) {
                    countCurrentVal++;
                } else {
                    currentVal = value;
                    countCurrentVal = 1;
                }

                if (countCurrentVal > 4) {
                    setWinner(currentVal);
                    return;
                }

            }
        }
    }
};

const checkDiagonal = () => {
    // bottom row going up right
    for (let acrossIndex = 0; acrossIndex < 5; acrossIndex++) {
        let currentVal = '';
        let countCurrentVal = 0;
        let diag = 0;
        for (let downIndex = 5; downIndex > -1; downIndex--) {
            const value = boardState[`${acrossIndex+diag}`][downIndex];
            if (_.isEmpty(value)) {
                // we start checking at the bottom
                //if there are no more above then we can short circuit this column
                continue;
            } else {
                if (currentVal === value) {
                    countCurrentVal++;
                } else {
                    currentVal = value;
                    countCurrentVal = 1;
                }

                if (countCurrentVal > 4) {
                    setWinner(currentVal);
                    return;
                }

            }
            diag++;
        }
    }
    // 2 bottom row going up right
    for (let acrossIndex = 0; acrossIndex < 4; acrossIndex++) {
        let currentVal = '';
        let countCurrentVal = 0;
        let diag = 0;
        for (let downIndex = 4; downIndex > -1; downIndex--) {
            const value = boardState[`${acrossIndex+diag}`][downIndex];
            if (_.isEmpty(value)) {
                // we start checking at the bottom
                //if there are no more above then we can short circuit this column
                continue;
            } else {
                if (currentVal === value) {
                    countCurrentVal++;
                } else {
                    currentVal = value;
                    countCurrentVal = 1;
                }

                if (countCurrentVal > 4) {
                    setWinner(currentVal);
                    return;
                }

            }
            diag++;
        }
    }
};

const checkBoardStateForWin = () => {
    //naive checks first
    //check for vertical and horizontal runs of repeating characters
    checkVertical();
    checkHorizontal();
    //this will never happen right? :-)
    checkDiagonal();
};

const setWinner = (val) => {
    if (val === 'x') {
        currentPlayers.player1.isWinner = true;
    } else {
        currentPlayers.player2.isWinner = true;
    }
};

const addEvent = (name) => {
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
        notifyEvents[e].notify(data);
    }
};

const currentPlayers = {
    player1: {},
    player2: {}
};

const newPlayersAllowed = () => {
    return _.isEmpty(currentPlayers.player1) || _.isEmpty(currentPlayers.player2);
};

const setNewPlayerName = (name) => {
    if (newPlayersAllowed()) {
        if (_.isEmpty(currentPlayers.player1)) {
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

    const columnIndex = columnId - 1;
    let validMove = false;
    for (let downIndex = 5; downIndex > -1; downIndex--) {
        const value = boardState[`${columnIndex}`][downIndex];
        if (_.isEmpty(value)) {
            boardState[`${columnIndex}`][downIndex] = valToMark;
            validMove = true;
            break;
        }
    }

    if (validMove) {
        checkBoardStateForWin();
        if (playerId === 1) {
            currentPlayers.player1.nextMove = false;
            currentPlayers.player2.nextMove = true;
        } else {
            currentPlayers.player1.nextMove = true;
            currentPlayers.player2.nextMove = false;
        }
    }
    notify('change', {});
};

const notifyAll = () => {
    notify('change', {});
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