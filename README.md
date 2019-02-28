# client-server-playground

Intended as a very simple game of connect 5 implemented using websockets and deployed as docker containers.

The project is split into the server portion which is responsible for game state and a client portion which is primarily concerned with gathering user input and displaying information form the server.

To get up and going you need to have docker installed. I've been using 18.03.0-ce, build 0520e24.

I've included utility scripts for building the docker images and some run scripts i've been using to work out the pipes needed to get comms channels open and stable. Obviously this isnt production quality just yet and its intended as a mimimum viable approach to the game.

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
./create-docker-network.sh
./run-container.sh
```

You should be prompted for a username from both client windows. Subsequent clients should be rejected after 2 are connected. Disconnecting either client should cause the entire game to be discontinued.