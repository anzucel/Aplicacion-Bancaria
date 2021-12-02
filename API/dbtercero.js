var config = require('./dbconfig');
const sql = require('mssql');

async function getThird() {
    try {
        let pool = await sql.connect(config);
        let tercero = await pool.request().query("SELECT * FROM Tercero");

        return tercero.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getThird : getThird
}