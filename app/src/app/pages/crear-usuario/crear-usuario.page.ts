import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage {

  nombre: string = "";
  nacimiento: string = "";
  direccion: string = "";
  telefono: string = "";
  usuario: string = "";
  password: string = "";

  constructor( private toastCtrl: ToastController) { }

  crearCuenta() {
    console.log(this.nombre, this.nacimiento, this.direccion, this.telefono, this.usuario, this.password);

    //insertar a la base de datos 

    this.presentToast("Cuenta creada correctamente");
    this.nombre = "";
    this.nacimiento = "";
    this.direccion = "";
    this.telefono = "";
    this.usuario = "";
    this.password="";
    
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

}
