const soap = require("soap");

function CorreiosSOAPClient() {
    this._url = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl";

    CorreiosSOAPClient.prototype.calculaPrazo = (dadosEntrega, callback) => {
        soap.createClient(this._url, (erro, cliente) => {
            console.log("Cliente SOAP criado...");
            cliente.CalcPrazo(dadosEntrega, callback);
        }); 
    }
}

module.exports = () => {
    return CorreiosSOAPClient;
};

