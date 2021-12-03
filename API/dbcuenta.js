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

async function creditAccount(info) {
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('NumeroCuenta', sql.NVarChar, info.accountNumber)
            .input('Monto', sql.NVarChar, info.amount)
            .execute("SPCreditAccount");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAccount : getAccount,
    creditAccount : creditAccount
}