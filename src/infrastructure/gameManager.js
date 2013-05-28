
var socketIO = require("socket.io"),

    util = require("util"),

Player = require("../models/player"),

Dominoes = require("../models/dominoes"),

logger = require("./logger"),
    
io = null,

start = function (server) {
       io = socketIO.listen(server);

       io.configure(function () {
           io.set("log level", 0);
       });

    io.sockets.on("connection", function (socket) {
        connectNewPlayer(socket);
        joinToARoomWhenRequestedBy(socket);
        manageInteractionsOf(socket);
        notifyAllWhenPlayerDisconnects(socket);
    });
},

connectNewPlayer = function (socket) {
    socket.on("new player", function (data) {
        var thePlayer = new Player(socket.id, data.name, data.ip);

        socket.set("player", thePlayer, function () {
            acceptConnectionOf(socket);
            notifyAllAboutNewPlayer(socket);
        });
    });
},

acceptConnectionOf = function (socket) {
    var allPlayers = getAllPlayersFrom(io.sockets.clients());

    socket.get("player", function (error, player) {
        var data = { yourId: player.id, allPlayers: allPlayers };
        socket.emit("connection accepted", data);
    });
},

getAllPlayersFrom = function (sockets) {
    var players = [];
    
    sockets.forEach(function (theSocket) {
        theSocket.get("player", function (error, player) {
            players.push(player);
        })
    });

    return players;
},

notifyAllAboutNewPlayer = function (socket) {
    socket.get("player", function (error, player) {
                socket.broadcast.emit("new player", player);
    });
},

joinToARoomWhenRequestedBy = function (socket) {
    socket.on("want to play", function (data) {
        changeStatusOf(socket, Player.status.WAITING);
        var roomName = joinToAnExistingRoomOrCreateOne(socket);

        if (isRoomReady(roomName)) {
            startGameIn(roomName);
        }
    });
},

changeStatusOf = function (socket, newStatus) {
    socket.get("player", function (error, player) {
        player.status = newStatus;
        io.sockets.emit("status changed", { id: player.id, status: newStatus });
    });
},

joinToAnExistingRoomOrCreateOne = function (socket) {
    var roomName = null,
    rooms = io.sockets.manager.rooms;

    for (var name in rooms) {
        if (rooms[name].length < 4) {
            // Remove the "/" leading character that is added by Socket.io to room names for internally use.
            roomName = name.substring(1);
            break;
        }
    }

    if (!roomName) {
        roomName = "room-" + socket.id;
    }

    socket.join(roomName);

    return roomName;
},

isRoomReady = function (roomName) {
    return io.sockets.clients(roomName).length === 4;
},

startGameIn = function (roomName) {
    var socketsInRoom = io.sockets.clients(roomName), dominoes = new Dominoes();
 
    dominoes.queueAndDeal(getAllPlayersFrom(socketsInRoom));

    var players = dominoes.playersQueue;

    socketsInRoom.forEach(function (socket) {
        socket.set("dominoes", dominoes, function () { });
        notifyThatGameRoomIsReady(socket, roomName, players);
        changeStatusOf(socket, Player.status.PLAYING);
           });

    io.sockets.in(roomName).emit("play tile", players[0].id);
},

notifyThatGameRoomIsReady = function (socket, roomName, players) {
    socket.get("player", function (error, player) {
        socket.emit("game room ready", {
            roomName: roomName,
            playersInRoom: players,
        tiles: player.tiles
        });
    });
},

manageInteractionsOf = function (socket) {
    socket.on("tile played", function (data) {
        socket.get("dominoes", function (err, dominoes) {
            tryProceedWithThePlay(dominoes, data);
        });
    });
},

tryProceedWithThePlay = function (dominoes, data) {
    try {
        var roomName = data.roomName;

        dominoes.placeOnTable(data.id, data.tile, data.position, data.rotate);
        io.sockets.in(roomName).emit("tile played", data);
        io.sockets.in(roomName).emit("play tile", dominoes.getCurrentPlayer().id);
    } catch (err) {
        var message = util.format("The attempt was rejected. Cause: %s.");
        logger.warn(message);
    }
},

notifyAllWhenPlayerDisconnects = function (socket) {
    socket.on("disconnect", function () {
        socket.get("player", function (error, player) {
            socket.broadcast.emit("player disconnected", player.id);
        });
    });
};

exports.start = start;
