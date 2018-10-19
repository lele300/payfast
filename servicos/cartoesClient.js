const restify = require("restify-clients");

function CartoesClient() {
    this._client =  restify.createJsonClient({
        url: "http://localhost:3001",
        version: "~1.0"
    });

    CartoesClient.prototype.autoriza = (cartao, callback) => {
        console.log("Consumindo API cartoes/autoriza");
        this._client.post("/cartoes/autoriza", cartao, callback);
    };
}

module.exports = () => {
    return CartoesClient;
};