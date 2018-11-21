const cluster = require("cluster");
const os = require("os"); // Lib que contém informações do sistema operacional como qtde de núcleos 

const cpus = os.cpus();
console.log("Executando Thread");
if (cluster.isMaster) { //Se for a thread principal, cria uma thread filha 
    console.log("Thread principal");
    cpus.forEach(() => {
        cluster.fork(); //Gera uma nova thread que é filha da thread principal
    });
} else {
    console.log("Thread slave");
    require("./index");
}

cluster.on("listening", worker => { //Quando ouvir um servidor, executa o callback
    console.log("Cluster conectado " +worker.process.pid);
});

cluster.on("exit", worker => { //Quando um cluster cair, ele loga o cluster e cria uma thread slave e executa o mesmo arquivo.
    console.log("Cluster %d desconectado", +worker.process.pid);
    cluster.fork();
});