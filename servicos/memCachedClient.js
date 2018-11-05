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
