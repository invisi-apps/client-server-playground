# client-server-playground

Intended as a very simple game of connect 5 implemented using websockets, written in nodejs and deployed as docker containers.

The project is split into the server portion which is responsible for game state and a client portion which is primarily concerned with gathering user input and displaying information form the server.



## Gameplay

The rules of the game are the same as the real world connect 4 game except that here you need to connect 5 counters.
It is implemented as a client/server type application and it has no graphical user interface beyond some simple ascii art in the terminal session you run it in.

As an example of what you should see there are some screenshots in the the documentation directory in the project. 

In the folowing images you can see the server running in the top left, the first players terminal in the top right and the second players terminal in the bottom right.

### Game in progress
![Sample Gameplay](documentation/screenshots/gameplay.png?raw=true "Sample gameplay")

### Winning screen
![Winning](documentation/screenshots/winning.png?raw=true "Winning")

You should follow the steps to get up and going in the Running section below. If anything goes wrong have a look in the Toubleshooting section at the bottom. Happy gaming.



## Running

To get up and going you need to have docker installed. I've been using 18.03.0-ce, build 0520e24.

I've included utility scripts for building the docker images and some run scripts i've been using to work out the pipes needed to get comms channels open and stable. This is not production quality just yet and its intended as a mimimum viable approach to the game.

To see it in action you should follow these steps. 

To start the server:
In a terminal from the root of the project:

```
cd server
./build-image.sh
./create-docker-network.sh
./run-container.sh
```

To start the clients:
In a new terminal shell from the root of the project:

```
cd client
./build-image.sh
./run-container.sh
```


## Developer setup
The client/server portions of this game are a pair of nodejs applications. To be able to work on this project you will need to have a node development environment setup. 

### Running server and clients in node locally
Server
```
cd server
npm install
npm start
```

Client (x2 or 3 if you want to see the 3rd one get rejected :-))
```
cd client
npm install
npm start
```


#### Server run options
You can specify the http port to listen out for connections on. eg
```
npm start 3000
```
will start the server and listen out for connections on the local machine ip and port 3000.

By default the server will listen on port ```3360```

#### Client run options
You can specify the url and port where the client will be able to find the server on. e.g
```
npm start someserver.ie 3000
```
will attempt to connect to http://someserver.ie:3000

By default the client will attempt to connect to http://localhost:3360

### Testing
Unit test in the project are written using [mocha](https://next.mochajs.org/) with [chai](https://www.chaijs.com/api/bdd/) assertions and are intended to cover the core game change state management.

To run the tests you can use the following commands:
```
cd server
npm install
npm test
```

```
cd client
npm install
npm test
```


##Troubleshooting

### General
You should be prompted for a username from both client terminal. Subsequent clients should be rejected after 2 are connected. Disconnecting either client should cause the entire game to be discontinued.

### Networking
Its a client/server application so its important that the cient be able to make requests to the server via port 3360. Thats just a random port that doesnt appear on the wiki page for commonly used ports so its unlikely to closh with any of the major applications out there but it might be blocked by your firewall. Running the docker containers on the same docker network and using the aliases as specified in the ```run-container.sh``` files above should let you see it all working. If you want to run it on different machines then you will need to modify the docker networking configurations yourself. See [Docker networking](https://docs.docker.com/v17.12/network/) for more details.

