const expect = require('chai').expect;
const mock = require('mock-require');
const _ = require('lodash');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


describe('connect 5 client', function() {
    beforeEach(function(done) {
        http.listen(3360, function () {
            console.log('listening on *:3360');
            done();
        });

        io.on('connection', function (socket) {
            socket.emit('initGame', {newPlayerAllowed: true});
        });


    });

    describe('client behaviour', function() {
        it('should connect to server and ask user for input', function(done) {
            const askQuestion = (val) => {
                expect(val).to.be.equal('Please enter your name');
                done();
            };
            mock('../main/userInput', {userInput: { askQuestion }});
            const client = require('../main/client');
        })
    });
});