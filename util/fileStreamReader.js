const fs = require("fs");
const arquivo = process.argv[2];

fs.createReadStream(arquivo)
    .pipe(fs.createWriteStream("arquivo-novo.jpg"))
    .on("finish", () => {
        console.log("Arquivo escrito com sucesso !");
    });