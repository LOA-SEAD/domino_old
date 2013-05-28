
define(["text!../views/tabs.html", "text!../views/lobby.html", "text!../views/credits.html", "text!../views/instructions.html", "text!../views/gameRoom.html", "./infrastructure/messenger", "jquery", "jqueryui"],
function (tabs, lobby, credits, instructions, gameRoom, messenger, $) {

    var start = function () {
        var canvas = $("#canvas");

        $(tabs)
        .hide()
        .appendTo("#canvas")
.append([lobby, credits, instructions])
.tabs();

        $('#tabs a').click(function()
        {
            $($('#tabs a')[0]).css('z-index', '0');
            $('#tabs a').removeClass('selected');
            $(this).addClass('selected');            
        });

        canvas.append(gameRoom);
    };

    messenger.subscribe("lobby ready", function () {
        $("#loading-game").remove();
        $("#tabs").show();
    });

    return {
        start: start
    };

});
