import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
})
export class InicioAdminPage {

  numeroCuenta: string = "";
  cantidadAcreditar: string = "";
  
  constructor(private route: Router,
              private toastCtrl: ToastController) { }

  crearCuenta(){
    console.log("crear usuario");
    this.route.navigate(['/crear-usuario']);
  }

  agregarServicio(){
    //con el numero de cuenta agregar el servicio de cuenta de ahorro
    console.log("agregar servicio");
    this.numeroCuenta = "";
    this.cantidadAcreditar = "";
  }

  bloquearCuenta(){
    //bloquear cuenta con el numero de cuenta
    console.log("bloquear cuenta");
    this.numeroCuenta = "";
    this.cantidadAcreditar = "";
  }

  acreditarCuenta(){

    if(this.cantidadAcreditar == ""){
      this.presentToast("Ingrese una cantidad para acreditar a la cuenta");
    }else{
      this.numeroCuenta = "";
      this.cantidadAcreditar = "";
    }

    console.log("acreditar a una cuenta");
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }
}
