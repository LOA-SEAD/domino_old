/**
* Represents a player in the context of the game.
*/

var util = require("util"),

VALID_TILE_FORMAT = /^[0-6]-[0-6]$/;

assertThatIsValid = function (tile) {
    if (typeof tile !== "string")
        throw new Error(util.format("A string was expected, but a %s was passed.", typeof tile));

    if (!VALID_TILE_FORMAT.test(tile))
        throw new Error(util.format("%s is not a valid tile format.", tile));
},

indexOfTile = function (tiles, candidate) {
    for (var i = 0; i < tiles.length; i++) {
        if (isSameTile(tiles[i], candidate))
            return i;
    }

    return -1;
},

isSameTile = function (one, other) {
    var last = one.length - 1;

    return one === other ? true :
        one[0] === other[last] && one[last] === other[0];
};

function Player(id, name, ip) {

    var status = Player.status.AVAILABLE, connectionTime = new Date(), score = 0, tiles = [];

        this.__defineGetter__("id", function () {
        return id;
    });

    this.__defineGetter__("name", function () {
        return name;
    });

    this.__defineGetter__("ip", function () {
        return ip;
    });

    this.__defineGetter__("connectedSinse", function () {
        return connectionTime.toLocaleTimeString();
    });

    this.__defineGetter__("status", function () {
        return status;
    });

    this.__defineSetter__("status", function (value) {
        status = value;
    });

    this.__defineGetter__("numberOfTiles", function () {
        return this.tiles.length;
    });

    this.__defineGetter__("score", function () {
        return score;
        });

        this.__defineSetter__("score", function (value) {
            score = value;
        });
    
        this.__defineGetter__("tiles", function () {
            return tiles;
        });

    };

Player.prototype = {

    drawTile: function (tile) {
        assertThatIsValid(tile);
        this.tiles.push(tile);
    },

    playTile: function (tile) {
        assertThatIsValid(tile);

        var index = indexOfTile(this.tiles, tile);

        if (index === -1)
            throw new Error(util.format("The player %s does not have the tile %s", this.name, tile));

        this.tiles.splice(index, 1);
    },

    devolveAllTiles: function () {
        this.tiles.splice(0);
    },

    equals: function(other) {
        return other == null ? false : 
        this == other ? true :
        ! other instanceof Player ? false :
        this.id === other.id;
    },

    toString: function () {
        return util.format("[%s (%s)]", this.name, this.id);
    }

    };

Player.status = {
AVAILABLE: "available",
WAITING: "waiting",
PLAYING: "playing"
};

module.exports = Player;
