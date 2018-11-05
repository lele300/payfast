const fs = require("fs"); //Modulo Core do Node que trata FilesSystems
module.exports = app => {
    app.post("/upload/image", (req, resp) => {
        console.log("Recebendo imagem...");
        const filename = req.headers.filename; // Recupera o nome do arquivo pelo header do Request
        req.pipe(fs.createWriteStream('novo' + filename)) //.pipe() cria uma execução simultânea
        // .createWriteStream() = o Stream recebe os chunks(pedaços do arquivo) aos poucos até completar o recebimento
        .on("finish", () => { // O evento finished manda um alerta e executa uma função de callback informando que o recebimento foi completado.
            console.log("Arquivo criado no servidor...");
            resp.status(201).send("OK");
        });
    });
}