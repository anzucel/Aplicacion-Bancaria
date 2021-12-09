import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transferencia-terceros',
  templateUrl: './transferencia-terceros.page.html',
  styleUrls: ['./transferencia-terceros.page.scss'],
})
export class TransferenciaTercerosPage implements OnInit {

  cantidad: string = "";
  cuentaOrigen: string = "";
  cuentaDestino: string = "";
  usuario: any;
  cuentasOrigen: any[] = [];
  cuentasDestino: any[] = [];

  constructor(private toastCtrl: ToastController,
              private DataService: DataLocalServiceService,
              private http: HttpClient) { }

  ngOnInit() {
    //recuperar todas las cuentas de origen y destino disponibles 
    this.DataService.cargarUsuario().then(
      (resp: string) =>{
        this.usuario = resp;
        console.log('Resp' + this.usuario);
        this.getOwnAccounts().then(
          (res: any) => {
            this.cuentasOrigen = res;
            console.log(this.cuentasOrigen);
          }
        );
        this.getAccounts().then(
          (res: any) =>{
            this.cuentasDestino = res;
            console.log(this.cuentasDestino);
          }
        )
      }
    );
  }

  transferir(cuenta){
    console.log();
    //hacer validaciones (trigger) para transferir la cantidad de una cuenta a otra
    if(this.cuentaOrigen != "" && this.cuentaDestino != ""){
     
      let info = {
        origen: this.cuentaOrigen,
        destino: this.cuentaDestino.substring(0,6),
        monto: this.cantidad
      }
  
      this.http.post(`http://localhost:8090/account/transfer`, info)
        .subscribe(response =>{
          console.log('post response', response);
          this.presentToast(response[0].Mensaje);
          //this.presentToast("Se han transferido Q. " + this.cantidad + " de la cuenta " + this.cuentaOrigen + " a la cuenta " + this.cuentaDestino);
        }
      );  
    }
    else{
      this.presentToast("Ingrese cuenta Destino y Origen");
    }

    // resetear valores 
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

  getOwnAccounts(){
    return this.http.get(`http://localhost:8090/account/getnumber/${this.usuario}`).toPromise();
  }

  getAccounts(){
    return this.http.get(`http://localhost:8090/account/getAccounts/${this.usuario}`).toPromise();
  }
}
