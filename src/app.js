var express = require("express"),

routes = require("./routes"),

http = require("http"),

path = require("path"),

gameManager = require("./infrastructure/gameManager"),

app = express();

app.configure(function () {
    app.set("port", process.env.PORT || 8001);
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "public")));
});

app.get("/", routes.index);
app.post("/jogo", routes.game);

var server = app.listen(app.get("port"), function () {
    console.info("[Express server listening on port %d.]", app.get("port"));
});

gameManager.start(server);
