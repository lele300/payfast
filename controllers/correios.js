module.exports = (app) => {
    app.post("/correios/calcula-prazo", (req, resp) => {
        let dadosEntrega = req.body;
        const clientSOAPCorreios = new app.servicos.correiosSOAPCliente();
        clientSOAPCorreios.calculaPrazo(dadosEntrega, (err, resultados) => {
            if(err) {
                console.log(err);
                resp.status(500).send(err);
                return;
            }
            console.log("Prazo calculado");
            resp.status(200).json(resultados);
        });
    });
};