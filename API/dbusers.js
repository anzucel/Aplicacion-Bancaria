var config = require('./dbconfig');
const sql = require('mssql');

async function getUsers() {
    try {
        let pool = await sql.connect(config);
        let users = await pool.request().query("SELECT * FROM Cuentahabiente");

        return users.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getUser(userName) { 
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('input_user', sql.NVarChar, userName)
            .query("SELECT * FROM Cuentahabiente WHERE Usuario=@input_user");

        return user.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function insertUser(user) {
    try {
        let pool = await sql.connect(config);
        let userToInsert = await pool.request()
            .input('Usuario', sql.NVarChar, user.user)
            .input('Nombres', sql.NVarChar, user.name)
            .input('Apellidos', sql.NVarChar, user.lastName)
            .input('FechaNacimiento', sql.Date, user.birthday)
            .input('Direccion', sql.NVarChar, user.address)
            .input('Telefono', sql.NVarChar, user.phoneNumber)
            .input('Contraseña', sql.NVarChar, user.password)
            .execute("SPInsertUser");

        return userToInsert.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function deleteUser(user) {
    try {
        let pool = await sql.connect(config);
        let userToDelete = await pool.request()
            .input('Usuario', sql.NVarChar, user.user)
            .execute("SPDeleteUser");

        return userToDelete.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsers : getUsers,
    getUser: getUser,
    insertUser : insertUser,
    deleteUser : deleteUser
}

