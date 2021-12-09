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

async function Transfer(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('origen', sql.NVarChar, info.origen)
            .input('destino', sql.NVarChar, info.destino)
            .input('monto', sql.NVarChar, info.monto)
            .execute("SPTransferir");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}

async function getInfoAccounts(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("select [No. Cuenta] as NoCuenta, Cuentahabiente, Tipo, Saldo, Estado from cuenta where Cuentahabiente = @input_user and Estado = 1");
        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getAccounts(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("select Tercero.Cuentahabiente, Tercero.[No. Cuenta] as NoCuenta from tercero inner join Cuenta on Tercero.[No. Cuenta] = Cuenta.[No. Cuenta] where Tercero.Usuario = @input_user and Tercero.Cuentahabiente <> @input_user and Cuenta.Estado = 1 ");
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
            .query("select Tercero.[No. Cuenta] as Cuenta  from tercero inner join Cuenta on Tercero.[No. Cuenta] = Cuenta.[No. Cuenta] where Tercero.Usuario = @input_user and Tercero.Cuentahabiente = @input_user and Cuenta.Estado = 1");

        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getHistorial(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("select CuentaEmisor, CuentaReceptor, Transaccion.Tipo, Transaccion.Monto, Transaccion.[Fecha y hora] as Fecha from Transaccion inner join Cuenta on Cuenta.[No. Cuenta] = CuentaEmisor or Cuenta.[No. Cuenta] = CuentaReceptor where Cuenta.Cuentahabiente = @input_user");
        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function changePassword(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('nuevaC', sql.NVarChar, info.password)
            .input('usuario', sql.NVarChar, info.user)
            .execute("SPCambiarContraseña");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}

async function addTAccount(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('usuario', sql.NVarChar, info.user)
            .input('usuarioT', sql.NVarChar, info.Tuser)
            .input('cuenta', sql.NVarChar, info.numberAccount)
            .execute("SPAgregarT");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}

async function deleteTAccount(info) { 
    try {
        let pool = await sql.connect(config);
        let infoToInsert = await pool.request()
            .input('usuario', sql.NVarChar, info.user)
            .input('usuarioT', sql.NVarChar, info.Tuser)
            .input('cuenta', sql.NVarChar, info.numberAccount)
            .execute("SPEliminarT");
        return infoToInsert.recordsets;
    } catch (error) {
        console.log(error);
    } 
}
module.exports = {
    getAccount : getAccount,
    getInfoAccounts: getInfoAccounts,
    creditAccount : creditAccount,
    createAccount: createAccount,
    blockAccount: blockAccount,
    getAccounts: getAccounts,
    getNumberAccounts: getNumberAccounts,
    Transfer: Transfer,
    getHistorial: getHistorial,
    changePassword: changePassword,
    addTAccount: addTAccount,
    deleteTAccount: deleteTAccount
}