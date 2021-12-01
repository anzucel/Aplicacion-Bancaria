var config = require('./dbconfig');
const sql = require('mssql');

async function getRegister() {
    try {
        let pool = await sql.connect(config);
        let register = await pool.request().query("SELECT * FROM Registro");

        return register.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRegister : getRegister
}