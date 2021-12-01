var config = require('./dbconfig');
const sql = require('mssql');

async function getAdmin() {
    try {
        let pool = await sql.connect(config);
        let admin = await pool.request().query("SELECT * FROM Administrador");

        return admin.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAdmin : getAdmin
}