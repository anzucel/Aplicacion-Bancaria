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

async function createAccount(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('NumeroCuenta', sql.NVarChar, info.accountNumber)
            .execute("SPCreateAccount");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}
 
async function blockAccount(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('NumeroCuenta', sql.NVarChar, info.accountNumber)
            .execute("SPBlockAccount");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}

async function getAccounts(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("SELECT * FROM Cuenta WHERE Cuentahabiente = @input_user and Estado = 1");

        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getNumberAccounts(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("SELECT [No. Cuenta] as Cuenta FROM Cuenta WHERE Cuentahabiente = @input_user and Estado = 1");

        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAccount : getAccount,
    creditAccount : creditAccount,
    createAccount: createAccount,
    blockAccount: blockAccount,
    getAccounts: getAccounts,
    getNumberAccounts: getNumberAccounts
}