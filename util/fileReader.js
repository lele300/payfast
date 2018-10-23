const fs = require("fs");
const arquivo = process.argv[2];
fs.readFile(arquivo, (err, buffer) => { //Lendo um arquivo e armazenado-o no Buffer de memória
    console.log("Arquivo carregado no Buffer de memória...");
    console.log("Preparando para escrever arquivo..." +arquivo);
    fs.writeFile("novo-arquivo.jpg", buffer, err => { //Escrevendo um arquivo com o próprio buffer lido da chamada anterior
        console.log("Arquivo " +arquivo+ " criado com sucesso !");
    });
});