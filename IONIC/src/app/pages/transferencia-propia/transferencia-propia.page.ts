import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-transferencia-propia',
  templateUrl: './transferencia-propia.page.html',
  styleUrls: ['./transferencia-propia.page.scss'],
})
export class TransferenciaPropiaPage implements OnInit {

  cantidad: string = "";
  cuentaOrigen: string = "";
  cuentaDestino: string = "";

  constructor(private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  transferir(cuenta){
    console.log();
    //hacer validaciones (trigger) para transferir la cantidad de una cuenta a otra
    

    // resetear valores 
    this.presentToast("Se han transferido Q. " + this.cantidad + " de la cuenta " + this.cuentaOrigen + " a la cuenta " + this.cuentaDestino);
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
