const expect = require('chai').expect;
const _ = require('lodash');
const gameState = require('../main/gameState').gameState;

// NOTE - x and o positions in the test board grid may not be legal moves when used to fill columns for convenience
describe('gameState', function() {
    beforeEach(function() {
        gameState.reset();
        gameState.setNewPlayerName('m');
        gameState.setNewPlayerName('j');
    });

    describe('winning gamestates', function () {
        describe('horizontals', function () {
            it('should find winning lines on bottom row for player 1', function () {
                gameState.boardState['0'][5] = 'x';
                gameState.boardState['1'][5] = 'x';
                gameState.boardState['2'][5] = 'x';
                gameState.boardState['3'][5] = 'x';
                // fill column 5 so the next piece will make a horizontal line of 5 x's
                gameState.makeMove({playerId: 1, columnId: '5'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
            it('should find winning line when horizontal mixed', function () {
                gameState.boardState['0'][5] = 'x';
                gameState.boardState['1'][5] = 'o';
                gameState.boardState['2'][5] = '';
                gameState.boardState['3'][5] = 'x';
                gameState.boardState['4'][5] = '';
                gameState.boardState['5'][5] = 'x';
                gameState.boardState['6'][5] = 'x';
                gameState.boardState['7'][5] = 'x';
                gameState.boardState['8'][5] = 'x';
                // fill column 5 so the next piece will make a horizontal line of 5 x's
                gameState.makeMove({playerId: 1, columnId: '5'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
            it('should find winning line on top ', function () {
                gameState.boardState['0'][0] = 'x';
                gameState.boardState['1'][0] = 'o';
                gameState.boardState['2'][0] = '';
                gameState.boardState['3'][0] = 'x';
                gameState.boardState['4'][5] = 'o';
                gameState.boardState['4'][4] = 'x';
                gameState.boardState['4'][3] = 'o';
                gameState.boardState['4'][2] = 'x';
                gameState.boardState['4'][1] = 'o';
                gameState.boardState['5'][0] = 'x';
                gameState.boardState['6'][0] = 'x';
                gameState.boardState['7'][0] = 'x';
                gameState.boardState['8'][0] = 'x';
                // fill column 5 so the next piece will make a horizontal line of 5 x's on the top row
                gameState.makeMove({playerId: 1, columnId: '5'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
        });
        describe('verticals', function () {
            it('should find winning lines in first column for player 2', function () {
                gameState.boardState['0'][5] = 'o';
                gameState.boardState['0'][4] = 'o';
                gameState.boardState['0'][3] = 'o';
                gameState.boardState['0'][2] = 'o';
                gameState.makeMove({playerId: 1, columnId: '5'});
                // fill column 1 so the next piece will make a vertical line of 5 o's
                gameState.makeMove({playerId: 2, columnId: '1'});
                expect(gameState.currentPlayers.player2.isWinner).to.eq(true);
            });
            it('should find winning lines in first column for player 1', function () {
                gameState.boardState['0'][5] = 'x';
                gameState.boardState['0'][4] = 'x';
                gameState.boardState['0'][3] = 'x';
                gameState.boardState['0'][2] = 'x';
                gameState.makeMove({playerId: 1, columnId: '1'});
                // fill column 1 so the next piece will make a vertical line of 5 o's
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
            it('should find winning lines in last column', function () {
                gameState.boardState['8'][5] = 'o';
                gameState.boardState['8'][4] = 'x';
                gameState.boardState['8'][3] = 'x';
                gameState.boardState['8'][2] = 'x';
                gameState.boardState['8'][1] = 'x';
                gameState.makeMove({playerId: 1, columnId: '9'});
                // fill column 9 so the next piece will make a vertical line of 5 o's
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
        });
        describe('diagonals', function () {
            it('should find winning lines up right from bottom', function () {
                gameState.boardState['0'][5]='x';
                gameState.boardState['1'][4]='x';
                gameState.boardState['2'][3]='x';
                gameState.boardState['3'][2]='x';
                // fill column 5 so the next piece will make a diagonal line of 5 x's
                gameState.boardState['4'][2]='o';
                gameState.boardState['4'][3]='o';
                gameState.boardState['4'][4]='o';
                gameState.boardState['4'][5]='o';
                gameState.makeMove({playerId:1, columnId:'5'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });

            it('should find winning lines up right from 2nd bottom', function () {
                gameState.boardState['1'][4]='x';
                gameState.boardState['2'][3]='x';
                gameState.boardState['3'][2]='x';
                gameState.boardState['4'][1]='x';
                // fill column 6 so the next piece will make a diagonal line of 5 x's
                gameState.boardState['5'][1]='o';
                gameState.boardState['5'][2]='o';
                gameState.boardState['5'][3]='x';
                gameState.boardState['5'][4]='o';
                gameState.boardState['5'][5]='o';
                gameState.makeMove({playerId:1, columnId:'6'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });

            it('should find winning lines up left from bottom', function () {
                gameState.boardState['5'][5]='x';
                gameState.boardState['4'][4]='x';
                gameState.boardState['3'][3]='x';
                gameState.boardState['2'][2]='x';
                // fill column 2 so the next piece will make a diagonal line of 5 x's
                gameState.boardState['1'][2]='o';
                gameState.boardState['1'][3]='o';
                gameState.boardState['1'][4]='o';
                gameState.boardState['1'][5]='o';
                gameState.makeMove({playerId:1, columnId:'2'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });

            it('should find winning lines up left from 2nd bottom', function () {
                gameState.boardState['4'][4]='x';
                gameState.boardState['3'][3]='x';
                gameState.boardState['2'][2]='x';
                gameState.boardState['1'][1]='x';
                // fill column 1 so the next piece will make a diagonal line of 5 x's
                gameState.boardState['0'][1]='o';
                gameState.boardState['0'][2]='o';
                gameState.boardState['0'][3]='x';
                gameState.boardState['0'][4]='o';
                gameState.boardState['0'][5]='o';
                gameState.makeMove({playerId:1, columnId:'1'});
                expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
            });
        });
    });

    describe('makeMove', function () {
        describe('specifying an invalid column', function () {
            it('should result in no change to game state', function () {
                gameState.boardState['0'][5] = 'x';
                const savedGameState = _.cloneDeep(gameState);
                gameState.makeMove({playerId: 1, columnId: 'a'});
                const newGameState = _.cloneDeep(gameState);
                expect(newGameState).to.deep.equal(savedGameState);
            });
        });

        describe('specifying a valid column', function () {
            it('should result in change to game state', function () {
                gameState.boardState['0'][5] = 'o';
                const savedGameState = _.cloneDeep(gameState);
                gameState.makeMove({playerId: 1, columnId: '1'});
                const newGameState = _.cloneDeep(gameState);
                expect(newGameState).to.not.deep.equal(savedGameState);
                expect(gameState.boardState['0'][5]).to.equal('o');
            });
        });

        describe('attempting an invalid player turn', function () {
            it('should result in no change to game state', function () {
                gameState.boardState['0'][5] = 'o';
                const savedGameState = _.cloneDeep(gameState);
                gameState.makeMove({playerId: 2, columnId: '1'});
                const newGameState = _.cloneDeep(gameState);
                expect(newGameState).to.deep.equal(savedGameState);
            });
        });

        describe('adding an entry when a column is full', function () {
            it('should result in no change to game state', function () {
                gameState.boardState['0'][5] = 'o';
                gameState.boardState['0'][4] = 'o';
                gameState.boardState['0'][3] = 'o';
                gameState.boardState['0'][2] = 'o';
                gameState.boardState['0'][1] = 'o';
                gameState.boardState['0'][0] = 'o';
                const savedGameState = _.cloneDeep(gameState);
                gameState.makeMove({playerId: 1, columnId: '1'});
                const newGameState = _.cloneDeep(gameState);
                expect(newGameState).to.deep.equal(savedGameState);
            });
        });
    });
});

