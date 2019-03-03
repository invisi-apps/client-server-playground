const expect = require('chai').expect;
const gameState = require('../main/gameLogic').gameLogic;


describe('gameLogic', function () {
    describe('getWinState', function () {
        it('should identify player 1 as the winner', function () {
            const playersWithPlayer1AsWinner = {
                player1: {
                    isWinner: true,
                    playerName: 'player1'
                },
                player2: {
                    playerName: 'player2'
                }
            };
            const result = gameState.getWinState(playersWithPlayer1AsWinner);
            expect(result.message).to.eq('We have a winner!\nCongratulations player1');
        });

        it('should identify player 2 as the winner', function () {
            const playersWithPlayer2AsWinner = {
                player1: {
                    playerName: 'player1'
                },
                player2: {
                    isWinner: true,
                    playerName: 'player2'
                }
            };
            const result = gameState.getWinState(playersWithPlayer2AsWinner);
            expect(result.message).to.eq('We have a winner!\nCongratulations player2');
        });

        it('should return undefined when no winner', function () {
            const playersWithNoWinner = {
                player1: {
                    playerName: 'player1'
                },
                player2: {
                    playerName: 'player2'
                }
            };
            const result = gameState.getWinState(playersWithNoWinner);
            expect(result).to.be.undefined;
        });
    });

});
