module.exports = (app) => {
    app.get("/pagamentos", (req,resp) => {
        console.log("Eu sou a rota Teste");
        resp.send("OK.");
    });

    app.get("/pagamentos/pagamento/:id", (req,resp) => {
        const id = req.params.id;
        let pagamentos = {};
        console.log("Consultando o Pgto. "+id);
        const connection = app.dao.connectionFactory();
        const pagamentoDAO = new app.dao.PagamentoDAO(connection);
        pagamentoDAO.buscaPorId(id, (err,results) => {
            if(err) {
                console.log("Erro ao consultar no banco: "+err);
                resp.status(500).send(err);
                return;
            }
            console.log("Pagamento encontrado: "+ JSON.stringify(results));
            resp.json(results);
        });
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
    
    app.delete("/pagamentos/pagamento/:id", (req,resp) => {
        let pagamento = {};
        const id = req.params.id; //Recupera o valor do parâmetro ID do request
        pagamento.id = id;
        pagamento.status = "CANCELADO";
        const connection = app.dao.connectionFactory();
        const pagamentoDAO = new app.dao.PagamentoDAO(connection);
        pagamentoDAO.atualiza(pagamento, (errors) => {
            if(errors) {
                resp.status(500).send(errors);
                return;
            }
            resp.status(204).send(pagamento);
        });
    });

    app.post("/pagamentos/pagamento", (req,resp) => {
        req.assert("pagamento.forma_de_pagamento","Forma de pagamento é obrigatória").notEmpty();
        req.assert("pagamento.valor","É necessário informar um valor e deve ser um decimal").notEmpty().isFloat();
        let errors = req.validationErrors();

        if(errors) {
            console.log("Erros de validação encontrados");
            resp.status(400).send(errors);
            return;
        }
        let pagamento = req.body["pagamento"];
        const PAGAMENTO_CRIADO = "CRIADO", 
            PAGAMENTO_CANCELADO = "CANCELADO", 
            PAGAMENTO_CONFIRMADO = "CONFIRMADO";

        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.dataPagamento = new Date();

        const connection = app.dao.connectionFactory();
        const pagamentoDAO = new app.dao.PagamentoDAO(connection);

        pagamentoDAO.salva(pagamento, (errors,results) => {
            if(errors) {
                console.log("Erro ao cadastrar no banco: "+errors);
                resp.status(500).send(errors);
                return;
            }
            pagamento.id = results.insertId; //Recupera o ID inserido no banco
            console.log("Objeto Pagamento foi criado no banco de dados");
            
            if(pagamento.forma_de_pagamento == "cartao"){
                const cartao = req.body["cartao"];    
                const serviceCartoes = new app.servicos.cartoesClient();
                serviceCartoes.autoriza(cartao, (exception, request, response, data) => {
                    if(exception) {
                        console.log(exception);
                        resp.status(400).send(exception);
                        return;
                    }
                    const res = {
                        dados_de_pagamento : pagamento,
                        cartao : data,
                        links : [
                            {
                                href : "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                                rel : PAGAMENTO_CONFIRMADO,
                                method : "PUT"
                            },
                            {
                                href : "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                                rel : PAGAMENTO_CANCELADO,
                                method : "DELETE" 
                            }
                        ]
                    };
                    resp.location("/pagamentos/pagamento/"+ pagamento.id);
                    resp.status(201).json(res);
                });
                return;
            }
            resp.location("/pagamentos/pagamento/"+ pagamento.id);
            const response = {
                dados_de_pagamento : pagamento,
                links : [
                    {
                        href : "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel : PAGAMENTO_CONFIRMADO,
                        method : "PUT"
                    },
                    {
                        href : "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                        rel : PAGAMENTO_CANCELADO,
                        method : "DELETE" 
                    }
                ]
            }; 
            resp.status(201).send(response);
            console.log("Pagamento com Payfast criado com sucesso!!!");
        });
        connection.end();
    });
}