﻿
var winston = require("winston"),

    logger = new winston.Logger({

        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: true
            })
        ]

    });


module.exports = logger;
