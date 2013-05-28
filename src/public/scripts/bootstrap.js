
define(["jquery", "knockout", "./infrastructure/socketService", "./presenter", "./viewModels/lobbyViewModel", "./viewModels/gameRoomViewModel"],
function ($, ko, socketService, presenter, lobbyViewModel, gameRoomViewModel) {

    var start = function (url, player) {
        socketService.connect(url, player);

        $(document).ready(function () {
            presenter.start();
            ko.applyBindings(lobbyViewModel, $("#lobby")[0]);
            ko.applyBindings(gameRoomViewModel, $("#game-room")[0]);
        });
    };

    return {
        start: start
    };
});
