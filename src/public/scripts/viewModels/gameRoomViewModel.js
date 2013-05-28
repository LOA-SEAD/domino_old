
define(["knockout", "underscore", "../infrastructure/messenger"],
function (ko, _, messenger) {

    var roomName = null,

    playerId = null,

    playersInRoom = ko.observableArray(),

    playerTiles = ko.observableArray(),

    playerMessages = ko.observableArray();

    active = ko.observable(false),

    getPlayersInRoom = ko.computed(function () {
        return playersInRoom.slice(0);
    }),

    getPlayerMessages = ko.computed(function () {
        return playerMessages.slice(0);
    }),

    getPlayerTiles = ko.computed(function () {
        return playerTiles.slice(0);
    }),

    isActive = ko.computed(function () {
        return active();
    }),

mapToPlayerViewModel = function (data) {
    return {
        id: data.id,
        name: data.name,
        numberOfTiles: ko.observable(data.numberOfTiles),
        isPlaying: ko.observable(false)
    };
};

    sendNewMessage = function () {
        messenger
    }

    messenger.subscribeAll({
        "lobby ready": function (id) {
            playerId = id;
        },

        "game room ready": function (data) {
            roomName = data.roomName;
            var players = _(data.playersInRoom)
            .map(function (player) {
                return mapToPlayerViewModel(player);
            });

            playersInRoom(players);
            playerTiles(data.tiles);
            active(true);
        },

        "new message received": function (id, data) {
            console.log('pqp');
            playerMessages.push([id, data]);
        },

        "play tile": function (id) {
                                    var previousPlayer = _(playersInRoom()).find(function(p) {
                return p.isPlaying() === true;
                        });
                        
                                    if (previousPlayer)
                                        previousPlayer.isPlaying(false);
            
            var currentPlayer = _(playersInRoom()).find(function (p) {
                return p.id === id;
            });
            currentPlayer.isPlaying(true);
                                                         }

    });

    return {
        getPlayersInRoom: getPlayersInRoom,
        getPlayerTiles: getPlayerTiles,
        isActive: isActive
    };

});
