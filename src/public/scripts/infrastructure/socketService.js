
define(["socket.io", "underscore", "./messenger"],
function (io, _, messenger) {

    var receivableEvents = ["connection accepted", "new player", "status changed", "game room ready", "player disconnected", "play tile", "tile played", "new message received"],

    emitableEvents = ["want to play", "play tile", "send new message"],

    socket = null,

connect = function (url, player) {
    socket = io.connect(url);

    socket.emit("new player", player);
    setupReceivableEvents();
    setupEmitableEvents();
},

setupReceivableEvents = function () {
    _(receivableEvents).each(function (event) {
        socket.on(event, function (data) {
            messenger.publish(event, data);
        });
    });
},

setupEmitableEvents = function () {
    _(emitableEvents).each(function (event) {
        messenger.subscribe(event, function (data) {
            socket.emit(event, data);
        });
    });
};

    return {
        connect: connect
    };

});
