class Cuentahabiente {
    constructor(user, name, lastName, birthday, address, phoneNumber, password) {
        this.user = user;
        this.name = name;
        this.lastName = lastName;
        this.birthday = birthday;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}

class AcreditarModel{
    constructor(accountNumber, amount){
        this.accountNumber = accountNumber;
        this.amount = amount;
    }
}

class Transfer{
    constructor(origen, destino, monto){
        this.origen = origen;
        this.destino = destino;
        this.monto = monto;
    }
}
module.exports = Cuentahabiente
module.exports = AcreditarModel
module.exports = Transfer