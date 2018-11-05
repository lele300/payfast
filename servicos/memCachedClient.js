const Memcached = require("memcached");

module.exports = () => {
    return createMemcachedClient;
};

function createMemcachedClient() {
    const client = new Memcached("localhost:11211", {
        retries : 10, // Nº de tentativas feitas por request se caso ele não encontrar a informação no cache.
        retry : 10000, // Tempo de espera entre a falha da busca da informação e a nova tentativa.
        remove: true
    });
    return client;
}

cliente.set("pagamento-20", {id :"20"}, 60000, erro => { // .set(chave do cache, info a ser armazenada no cache, tempo que ficará no cache, callback);
    console.log("Nova chave adicionada ao cache: pagamento-20");
});

cliente.get("pagamento-20", (erro, result) => {
    if(erro || !result) {
        console.log("MISS - Chave não encontrada");
    } 
    console.log("HIT - Valor: "+ JSON.stringify(result));
});