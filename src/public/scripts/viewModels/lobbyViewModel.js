
define(["knockout", "underscore", "../infrastructure/messenger", "../utilities/messageBundle"],
function (ko, _, messenger, messageBundle) {

    var playerId = null,

    connectedPlayers = ko.observableArray(),

    playerIsAvailable = ko.observable(true),

    getConnectedPlayers = ko.computed(function () {
        return connectedPlayers.slice(0);
    }),

    getStatistics = ko.computed(function () {
        var allPlayers = connectedPlayers(),
        statistics = {
            connected: allPlayers.length,
            available: 0,
            waiting: 0,
            playing: 0
        },
        count = _(allPlayers)
        .countBy(function (player) {
            return determineGroupFrom(player.status());
        });

        return _.extend(statistics, count);
    }),

    determineGroupFrom = function (status) {
        return status === messageBundle.getMessage("available") ? "available" :
        status === messageBundle.getMessage("waiting") ? "waiting" :
        "playing";
    },

    canPlay = ko.computed(function () {
        return connectedPlayers().length >= 4 && playerIsAvailable();
    }),

    play = function () {
        messenger.publish("want to play");
    },

    addNewPlayer = function (data) {
    var player = mapToPlayerViewModel(data);
            connectedPlayers.push(player);
            },

    mapToPlayerViewModel = function (data) {
        return {
        id: data.id,
        name: data.name,
        connectedSinse: data.connectedSinse,
        status: ko.observable(messageBundle.getMessage(data.status)),
                score: ko.observable(data.score) 
        };
    };

    messenger.subscribeAll({
        "connection accepted": function (data) {
            playerId = data.yourId;

            _(data.allPlayers)
            .each(function (thePlayer) {
                addNewPlayer(thePlayer);
            });

            messenger.publish("lobby ready", playerId);
        },

        "new player": function (player) {
            addNewPlayer(player);
        },

        "status changed": function (data) {
            var id = data.id,
            newStatus = messageBundle.getMessage(data.status),
            thePlayer = _(connectedPlayers())
.find(function (player) {
    return player.id === id;
});

            thePlayer.status(newStatus);

            if (id === playerId)
                playerIsAvailable(false);
        },
        
        "player disconnected": function (id) {
            connectedPlayers.remove(function (thePlayer) {
                return thePlayer.id === id;
            });
        }

    });

    return {
        getConnectedPlayers: getConnectedPlayers,
        getStatistics: getStatistics,
        canPlay: canPlay,
        play: play
    };

});
