const expect = require('chai').expect;



describe('winning gamestates', function () {

    describe('diagonals', function () {
        it('should find winning lines up right from bottom', function () {
            const gameState = require('../main/gameState').gameState;
            gameState.setNewPlayerName('m');
            gameState.setNewPlayerName('j');
            gameState.boardState['0'][5]='x';
            gameState.boardState['1'][4]='x';
            gameState.boardState['2'][3]='x';
            gameState.boardState['3'][2]='x';
            gameState.boardState['4'][5]='o';
            gameState.boardState['4'][4]='o';
            gameState.boardState['4'][3]='o';
            gameState.boardState['4'][2]='o';
            gameState.makeMove({playerId:1, columnId:5});
            expect(gameState.currentPlayers.player1.isWinner).to.eq(true);
        });
    });

});
