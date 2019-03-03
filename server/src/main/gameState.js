const _ = require('lodash');


/*------------------------- Observability of the gamestate -----------------------------*/
const events = {};
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

const notifyAll = () => {
    notify('change', {});
};

/*------------------------- Operations allowed gamestate -----------------------------*/
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

const currentPlayers = {
    player1: {},
    player2: {}
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
                break;
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

const checkDiagonalUpRight = ({startAcross, endAcross, startDown, endDown}) => {
    for (let acrossIndex = startAcross; acrossIndex < endAcross; acrossIndex++) {
        let currentVal = '';
        let countCurrentVal = 0;
        let diag = 0;
        for (let downIndex = startDown; downIndex > endDown; downIndex--) {
            const value = boardState[`${acrossIndex+diag}`][downIndex];
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
            diag++;
        }
    }
};

const checkDiagonalUpLeft = ({startAcross, endAcross, startDown, endDown}) => {
    for (let acrossIndex = startAcross; acrossIndex > endAcross; acrossIndex--) {
        let currentVal = '';
        let countCurrentVal = 0;
        let diag = 0;
        for (let downIndex = startDown; downIndex > endDown; downIndex--) {
            const value = boardState[`${acrossIndex-diag}`][downIndex];
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
            diag++;
        }
    }
};

const checkDiagonal = () => {
    // bottom row going up right
    const diagUpRightFromBottomResult = checkDiagonalUpRight({startAcross:0, endAcross:4, startDown:5, endDown:-1});
    if (!_.isUndefined(diagUpRightFromBottomResult)) {
        return;
    }

    // 2 bottom row going up right
    const diagUpRight2Result = checkDiagonalUpRight({startAcross:0, endAcross:3, startDown:4, endDown:-1});
    if (!_.isUndefined(diagUpRight2Result)) {
        return;
    }

    // bottom row going up left
    const diagUpLeftFromBottomResult = checkDiagonalUpLeft({startAcross:8, endAcross:4, startDown:5, endDown:-1});
    if (!_.isUndefined(diagUpLeftFromBottomResult)) {
        return;
    }

    // 2nd bottom row going up left
    const diagUpLeftFrom2ndBottomResult = checkDiagonalUpLeft({startAcross:8, endAcross:5, startDown:4, endDown:-1});
    if (!_.isUndefined(diagUpLeftFrom2ndBottomResult)) {
        return;
    }
};

const checkBoardStateForWin = () => {
    //naive checks first
    //check for vertical and horizontal runs of repeating characters
    checkVertical();
    checkHorizontal();
    // check for diagonals
    checkDiagonal();
};

const setWinner = (val) => {
    if (val === 'x') {
        currentPlayers.player1.isWinner = true;
    } else {
        currentPlayers.player2.isWinner = true;
    }
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
                id: 2
            };
            setNextMoveStateForPlayerAfter(2);
            return currentPlayers.player2;
        }
    }
};

const validateColumnNum = (columnNum) => {
    const parsedInt = parseInt(columnNum);
    return (_.isNumber(parsedInt) && parsedInt <=9 && parsedInt >=1);
};

const getNextMoveDetails = () => {
    if (currentPlayers.player1.nextMove === true ) {
        return {
            playerId: currentPlayers.player1.id,
            valToMark: 'x'
        }
    } else {
        return {
            playerId: currentPlayers.player2.id,
            valToMark: 'o'
        }
    }
};

const setNextMoveStateForPlayerAfter = (playerId) => {
    if (playerId === 1) {
        currentPlayers.player1.nextMove = false;
        currentPlayers.player2.nextMove = true;
    } else {
        currentPlayers.player1.nextMove = true;
        currentPlayers.player2.nextMove = false;
    }
};

const makeMove = ({playerId, columnId}) => {
    if (!validateColumnNum(columnId)) {
        notify('change', {});
        console.log(`Invalid column id detected: ${columnId}. Asking to enter again.`);
        return;
    }

    let nextMoveDetails = getNextMoveDetails();
    if (nextMoveDetails.playerId !== playerId) {
        notify('change', {});
        console.log(`Received move request for invalid player ${playerId}`);
        return;
    }

    const columnIndex = columnId - 1;
    let validMove = false;
    for (let downIndex = 5; downIndex > -1; downIndex--) {
        const value = boardState[`${columnIndex}`][downIndex];
        if (_.isEmpty(value)) {
            boardState[`${columnIndex}`][downIndex] = nextMoveDetails.valToMark;
            validMove = true;
            break;
        }
    }

    if (validMove) {
        checkBoardStateForWin();
        setNextMoveStateForPlayerAfter(playerId);
    } else {
        console.log(`No valid move available for this request: playerId ${playerId}, columnId: ${columnId}`);
    }
    notify('change', {});
};

const reset = () => {
    for (let downIndex = 5; downIndex > -1; downIndex--) {
        for (let acrossIndex = 0; acrossIndex < 9; acrossIndex++) {
            boardState[`${acrossIndex}`][downIndex] = '';
        }
    }
    currentPlayers.player1 = {};
    currentPlayers.player2 = {};
};

exports.gameState = {
    newPlayersAllowed,
    setNewPlayerName,
    makeMove,
    register,
    notifyAll,
    boardState,
    currentPlayers,
    reset
};