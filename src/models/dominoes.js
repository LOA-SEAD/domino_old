/**
* Represents the dominoes as the game concept. Instances of this module are responsible by make a queue of the players, deal the tiles among then and manage the order of the plays.    
*/

var util = require("util"),

Player = require("./player"),

MAXIMUM_PLAYERS_ALLOWED = 4,

    POSITION_LEFT = "left",

    POSITION_RIGHT = "right",

boneyard = (function () {
    var doubleSixSet = [];

    for (var i = 0; i < 7; i++) {
        for (var j = i; j < 7; j++) {
            doubleSixSet.push(i + "-" + j);
        }
    }

    return doubleSixSet;
}()),

checkPreconditions = function (players) {
    if (!Array.isArray(players) || !containsOnlyPlayers(players))
        throw new Error("A valid array containing only Player objects is required.");

    if (players.length > MAXIMUM_PLAYERS_ALLOWED)
        throw new Error(util.format("The number of players to deal (%d) has exceeded the maximum value of %d.", players.length, MAXIMUM_PLAYERS_ALLOWED));
},

containsOnlyPlayers = function (players) {
    return players.every(function (thePlayer) {
        return thePlayer instanceof Player;
    });
},

deal = function (playersQueue) {
    shuffle(boneyard);

    var stock = boneyard.slice(0), nextToDraw = 0, lastPlayerInQueue = playersQueue[playersQueue.length - 1];

    while (lastPlayerInQueue.numberOfTiles !== 7) {
        var tile = stock.shift();
        playersQueue[nextToDraw].drawTile(tile);
        nextToDraw = determineNextIndex(nextToDraw, playersQueue.length);
    }

    return stock;
},

shuffle = function (theArray) {
    var current, numberOfUnshuffleds = theArray.length;

    while (--numberOfUnshuffleds) {
        current = getRamdomIndex(numberOfUnshuffleds);
        swapInArray(theArray, current, numberOfUnshuffleds);
    }
},

getRamdomIndex = function (max) {
    return Math.floor(Math.random() * (max + 1));
},

swapInArray = function (theArray, a, b) {
    var temporary = theArray[a];
    theArray[a] = theArray[b];
    theArray[b] = temporary;
},

determineNextIndex = function (currentIndex, numberOfPlayers) {
    return currentIndex === numberOfPlayers - 1 ? 0 : currentIndex + 1;
},

rotateTile = function (tile) {
    return tile.split("").reverse().join("");
},

assertThatIsSame = function (queue, player, idOfCandidate) {
    var candidate = findPlayerById(queue, idOfCandidate);

    if (!player.equals(candidate))
        throw new Error(util.format("The player %s is not the player that should be playing now (%s).", candidate.name, player.name));
},

findPlayerById = function (queue, id) {
    return queue.filter(function (p) {
        return p.id === id;
    })[0];
},

assertThatCanBeAligned = function (lineOfPlay, tile, position) {
    if (position.toLowerCase() !== POSITION_LEFT && position.toLowerCase() !== POSITION_RIGHT)
        throw new Error(util.format("%s is not a valid value for the parameter position. Only %s and %s are allowed.", position, POSITION_LEFT, POSITION_RIGHT));

    if (!lineOfPlay.length)
        return true;

    var adjacentTile = position === POSITION_LEFT ? lineOfPlay[0] : lineOfPlay[lineOfPlay.length - 1];

    var canAlign = position === POSITION_LEFT ? tile[tile.length - 1] === adjacentTile[0] :
        adjacentTile[adjacentTile.length - 1] === tile[0];

    if (!canAlign)
        throw new Error(util.format("%s can not be aligned with %s.", tile, adjacentTile));
};

function Dominoes() {

    var playersQueue = [], lineOfPlay = [], indexOfCurrentPlayer = 0;

    this.__defineGetter__("playersQueue", function () {
        return playersQueue;
    });

    this.__defineGetter__("lineOfPlay", function () {
        return lineOfPlay;
    });

    this.__defineGetter__("indexOfCurrentPlayer", function () {
        return indexOfCurrentPlayer;
    });

    this.__defineSetter__("indexOfCurrentPlayer", function (value) {
        indexOfCurrentPlayer = value;
    });

};

Dominoes.prototype = {

    queueAndDeal: function (players) {
        checkPreconditions(players);

        if (this.playersQueue.length)
            throw new Error("Players already are enqueued by this instance.");

        // Append all players at once.
        this.playersQueue.push.apply(this.playersQueue, players);
        shuffle(this.playersQueue);

        return deal(this.playersQueue);
    },

    placeOnTable: function (idOfPlayer, tile, position, shouldRotate) {
        if (shouldRotate)
            tile = rotateTile(tile);

        var thePlayer = this.getCurrentPlayer();

        assertThatIsSame(this.playersQueue, thePlayer, idOfPlayer);
        assertThatCanBeAligned(this.lineOfPlay, tile, position);

        thePlayer.playTile(tile);

        if (position === POSITION_LEFT)
            // Insert the tile at the first position. 
            this.lineOfPlay.splice(0, 0, tile);
        else
            // Insert the tile at the last position.
            this.lineOfPlay.push(tile);

        this.skipToNextPlayer();
    },

    skipToNextPlayer: function() {
        var current = this.indexOfCurrentPlayer, amount = this.playersQueue.length;
        this.indexOfCurrentPlayer = determineNextIndex(current, amount);
    },

    getCurrentPlayer: function () {
        return this.playersQueue[this.indexOfCurrentPlayer];
    },

    getDominoSet: function () {
        return boneyard.slice(0).sort();
    }

};

module.exports = Dominoes;
