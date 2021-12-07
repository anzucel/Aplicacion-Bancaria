import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-transferencia-terceros',
  templateUrl: './transferencia-terceros.page.html',
  styleUrls: ['./transferencia-terceros.page.scss'],
})
export class TransferenciaTercerosPage implements OnInit {

  cantidad: string = "";
  cuentaOrigen: string = "";
  cuentaDestino: string = "";

  constructor(private toastCtrl: ToastController) { }

  ngOnInit() {
    //recuperar todas las cuentas de origen y destino disponibles 
  }

  transferir(cuenta){
    console.log();
    //hacer validaciones (trigger) para transferir la cantidad de una cuenta a otra
    

    // resetear valores 
    this.presentToast("Se han transferido Q. " + this.cantidad + " de la cuenta " + this.cuentaOrigen + " a " + this.cuentaDestino);
    this.cantidad = "";
    this.cuentaOrigen = "";
    this.cuentaDestino  = "";
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500
    });
    toast.present();
  }
}
