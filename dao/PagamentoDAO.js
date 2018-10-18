function PagamentoDAO(connection){
    this._connection = connection;

    PagamentoDAO.prototype.salva = (pagamento, callback) => {
        this._connection.query("INSERT INTO pagamento SET ?", pagamento, callback);
    };

    PagamentoDAO.prototype.lista = callback => {
        this._connection.query("SELECT * FROM pagamento", callback);
    };

    PagamentoDAO.prototype.buscaPorId = (id, callback) => {
        this._connection.query("SELECT * FROM pagamento WHERE id =",[id], callback);
    };
}

module.exports = () => {
    return PagamentoDAO;
};