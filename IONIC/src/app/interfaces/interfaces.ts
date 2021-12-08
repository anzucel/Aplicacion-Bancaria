export interface User {
    Usuario: string,
    Nombres: string,
    Apellidos: string,
    FechaNacimiento: string,
    Direccion: string,
    Telefono: string,
    Contraseña: string
}

export interface Cuenta {
    NoCuenta: number,
    Cuentahabiente: string,
    Tipo: string,
    Saldo: number,
    Estado: boolean
}