module.exports = (app) => {
    app.get("/pagamentos", (req,resp) => {
        console.log("Eu sou a rota Teste");
        resp.send("OK.");
    });

    app.post("/pagamentos/pagamento", (req,resp) => {
        const pagamento = req.body;
        pagamento.status = "CRIADO";
        pagamento.dataPagamento = new Date();
        const connection = app.dao.connectionFactory();
        const pagamentoDAO = new app.dao.PagamentoDAO(connection);
        pagamentoDAO.salva(pagamento, (errors,results) => {
            if(errors) {
                resp.status(400).send(errors);
                console.log(errors);
                return;
            } 
            resp.send(pagamento);
            console.log("Pagamento criado com sucesso");
        });
    });
}