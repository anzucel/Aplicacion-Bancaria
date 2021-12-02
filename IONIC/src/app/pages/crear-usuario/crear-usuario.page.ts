import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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

  constructor( private toastCtrl: ToastController,
                private http: HttpClient) { }

  crearCuenta() {
    console.log(this.nombre, this.nacimiento, this.direccion, this.telefono, this.usuario, this.password);

    //insertar a la base de datos 
    let user ={
      user: this.usuario,
      name: this.nombre,
      lastName: this.nombre,
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
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

}
