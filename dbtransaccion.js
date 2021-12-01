var config = require('./dbconfig');
const sql = require('mssql');

async function getTransaction() {
    try {
        let pool = await sql.connect(config);
        let transcation = await pool.request().query("SELECT * FROM Transaccion");

        return transcation.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getTransaction : getTransaction
}