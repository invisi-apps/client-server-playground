const expect = require('chai').expect;
const io = require('socket.io-client');

// This is a minimal(ish) integration test to exercise the main pipes and ensure that 2 players can register
describe('server', function () {
    let server;
    before(function (done) {
        server = require('../main/server');
        server.on("app_started", function () {
            done();
        });
    });

    describe('connection behaviour', function () {
        it('should trigger a player registration process resulting in a valid gamestate', function (done) {
            // Inititate a socker connection with the server
            const socket = io.connect('http://localhost:3360');
            let firstTimeMsg = true;
            // Listen for the init message
            socket.on('initGame', (msg) => {
                // Verify new players allowed
                expect(msg.newPlayerAllowed).to.be.true;
                // Listen out for the player registered data
                socket.on('registeredPlayer', (playerInfo) => {
                    // Verify its the player one registration event
                    expect(playerInfo.playerName).to.be.equal('testPlayer');
                    expect(playerInfo.playerId).to.be.equal(1);
                });
                // Listen out for the updated gamestate
                socket.on('gamestate', ({currentPlayers, boardState}) => {
                    // avoid going into a loop of adding more players
                    if (firstTimeMsg) {
                        // Verify the initial gamestate
                        expect(currentPlayers).to.deep.equal({
                            "player1": {"playerName": "testPlayer", "id": 1},
                            "player2": {}
                        });
                        expect(boardState).to.deep.equal({
                            "0": ["", "", "", "", "", ""],
                            "1": ["", "", "", "", "", ""],
                            "2": ["", "", "", "", "", ""],
                            "3": ["", "", "", "", "", ""],
                            "4": ["", "", "", "", "", ""],
                            "5": ["", "", "", "", "", ""],
                            "6": ["", "", "", "", "", ""],
                            "7": ["", "", "", "", "", ""],
                            "8": ["", "", "", "", "", ""]
                        });

                        // Create a second socket connection for player 2
                        const socket2 = io.connect('http://localhost:3360');
                        // Listen out for the init message
                        socket2.on('initGame', (msg) => {
                            // Verify its ok to proceed
                            expect(msg.newPlayerAllowed).to.be.true;
                            // Listen out for the registered player details for player 2
                            socket2.on('registeredPlayer', (playerInfo) => {
                                // Second player registered successfully
                                expect(playerInfo.playerName).to.be.equal('testPlayer2');
                                expect(playerInfo.playerId).to.be.equal(2);
                            });
                            // Listen out for the gamestate messages for player 2
                            socket2.on('gamestate', ({currentPlayers, boardState}) => {
                                // Expect the gamestate to include 2 players and turn information
                                expect(currentPlayers).to.deep.equal({
                                    "player1": {"playerName": "testPlayer", "id": 1, "nextMove": true},
                                    "player2": {"playerName": "testPlayer2", "id": 2, "nextMove": false},
                                });
                                expect(boardState).to.deep.equal({
                                    "0": ["", "", "", "", "", ""],
                                    "1": ["", "", "", "", "", ""],
                                    "2": ["", "", "", "", "", ""],
                                    "3": ["", "", "", "", "", ""],
                                    "4": ["", "", "", "", "", ""],
                                    "5": ["", "", "", "", "", ""],
                                    "6": ["", "", "", "", "", ""],
                                    "7": ["", "", "", "", "", ""],
                                    "8": ["", "", "", "", "", ""]
                                });
                                // player 2 has received a valid game state - fin
                                done();
                            });
                            socket2.emit('registerPlayer', {playerName: 'testPlayer2'});
                            firstTimeMsg = false;
                        });
                    } else {
                        // second game call to player 1 - verify it has the 2 players
                        // I'm going to stop here because its proved the pattern but
                        // if you wanted you could keep going and test every call
                        // its not awfully easy to read hence the comments but for an MVP it will do.
                        expect(currentPlayers).to.deep.equal({
                            "player1": {"playerName": "testPlayer", "id": 1, "nextMove": true},
                            "player2": {"playerName": "testPlayer2", "id": 2, "nextMove": false},
                        });
                        expect(boardState).to.deep.equal({
                            "0": ["", "", "", "", "", ""],
                            "1": ["", "", "", "", "", ""],
                            "2": ["", "", "", "", "", ""],
                            "3": ["", "", "", "", "", ""],
                            "4": ["", "", "", "", "", ""],
                            "5": ["", "", "", "", "", ""],
                            "6": ["", "", "", "", "", ""],
                            "7": ["", "", "", "", "", ""],
                            "8": ["", "", "", "", "", ""]
                        });
                    }
                });
                socket.emit('registerPlayer', {playerName: 'testPlayer'});
            });
        });
    });
});