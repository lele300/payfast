const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const morgan = require("morgan"); //Intercepta a requisição do Express
const logger = require("../servicos/logger"); //Utilizado para escrever logs

module.exports = () => {
    const app = express();
    app.use(morgan("common", { // .morgan(formato, options)
        stream : { //Utilizado para não parar a execução do programa para escrever logs
            write : message => { //Tudo que o padrão common(headers, body do request, etc...) fica disponível na variável message 
                logger.info(message);
            }
        }
    }));
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json());
    app.use(expressValidator());
    consign()
        .include("controllers")
        .then("dao")
        .then("servicos")
        .into(app);

    return app;
};
