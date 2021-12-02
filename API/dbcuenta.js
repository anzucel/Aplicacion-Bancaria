var config = require('./dbconfig');
const sql = require('mssql');

async function getAccount() {
    try {
        let pool = await sql.connect(config);
        let cuenta = await pool.request().query("SELECT * FROM Cuenta");

        return cuenta.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAccount : getAccount
}