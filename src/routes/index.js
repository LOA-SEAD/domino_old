/**
* The routing system.
*/

exports.index = function (request, response) {
    response.render("index.ejs");
}

exports.game = function (request, response) {
    var url = request.protocol + "://" + request.headers.host,
        name = request.param("name"),
   		ip = request.ip;
          
        var teste = response.render("game.ejs", {url: url, name: name, ip: ip});
        
    }
