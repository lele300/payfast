module.exports = (app) => {
    app.get("/pagamentos", (req,resp) => {
        console.log("Eu sou a rota Teste");
        resp.send("OK.");
    });

    app.post("/pagamentos/pagamento", (req,resp) => {
        const pagamento = req.body;
        console.log(pagamento);
        resp.send("OK. Pagamento recebido");
    });
}

