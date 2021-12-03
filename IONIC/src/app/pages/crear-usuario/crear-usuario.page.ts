import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})

export class CrearUsuarioPage {

  primerNombre: string = "";
  segundoNombre: string = "";
  apellidos: string = "";
  nacimiento: string = "";
  direccion: string = "";
  telefono: string = "";
  usuario: string = "";
  password: string = "";
  nombreCompleto: string = "";

  constructor( private toastCtrl: ToastController,
                private http: HttpClient) { }

  crearCuenta() {

    if(this.segundoNombre != ""){
      this.nombreCompleto = this.primerNombre + " " + this.segundoNombre;
    }else{
      this.nombreCompleto = this.primerNombre;
    }

    //insertar a la base de datos 
    let user ={
      user: this.usuario,
      name: this.nombreCompleto,
      lastName: this.apellidos,
      birthday: this.nacimiento,
      address: this.direccion,
      phoneNumber: this.telefono,
      password: this.password
    }

    this.http.post('http://localhost:8090/users/insert', user)
    .subscribe(response =>{
      console.log('post response', response);
    });

    this.presentToast("Cuenta creada correctamente");  

    //vaciar variables 
    this.primerNombre = "";
    this.segundoNombre = "";
    this.apellidos = "";
    this.nacimiento = "";
    this.direccion = "";
    this.telefono = "";
    this.usuario = "";
    this.password = "";
    this.nombreCompleto = "";
    
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

}
