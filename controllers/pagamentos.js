module.exports = (app) => {
    app.get("/pagamentos", (req,resp) => {
        console.log("Eu sou a rota Teste");
        resp.send("OK.");
    });

    app.put("/pagamentos/pagamento/:id", (req,resp) => {
        let pagamento = {};
        const id = req.params.id; //Recupera o valor do parâmetro ID do request
        pagamento.id = id;
        pagamento.status = "CONFIRMADO";
        const connection = app.dao.connectionFactory();
        const pagamentoDAO = new app.dao.PagamentoDAO(connection);
        pagamentoDAO.atualiza(pagamento, (errors) => {
            if(errors) {
                resp.status(500).send(errors);
                return;
            }
            resp.status(200).send(pagamento);
        });
    });

    app.post("/pagamentos/pagamento", (req,resp) => {
        let pagamento = req.body;
        req.assert("forma_de_pagamento","Forma de pagamento é obrigatória").notEmpty();
        req.assert("valor","É necessário informar um valor e deve ser um decimal").notEmpty().isFloat();
        let errors = req.validationErrors();
        if(errors) {
            resp.status(500).send(errors);
            console.log("Erros de validação encontrados");
            return;
        }
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
            resp.location("/pagamentos/pagamento/"+ results.insertId);
            resp.status(201).send(pagamento);
            console.log("Pagamento criado com sucesso");
        });
        connection.end();
    });
}