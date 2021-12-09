import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';
import { Cuenta } from '../../interfaces/interfaces';

@Component({
  selector: 'app-transferencia-propia',
  templateUrl: './transferencia-propia.page.html',
  styleUrls: ['./transferencia-propia.page.scss'],
})
export class TransferenciaPropiaPage implements OnInit {

  cantidad: string = "";
  cuentaOrigen: string = "";
  cuentaDestino: string = "";
  cuentasUsuario: any[] = [];
  usuario: any;

  constructor(private toastCtrl: ToastController,
              private DataService: DataLocalServiceService,
              private http: HttpClient) { }

  ngOnInit() {
    //recuperar todas las cuentas de origen y destino disponibles (son las mismas)
    this.DataService.cargarUsuario().then(
      (resp: string) =>{
        this.usuario = resp;
        console.log('Resp' + this.usuario);
        this.getAccounts().then(
          (res: any) => {
            this.cuentasUsuario = res;
            console.log(this.cuentasUsuario);
          }
        );
      }
    );
  }

  transferir(cuenta){
    console.log();
    //hacer validaciones (trigger) para transferir la cantidad de una cuenta a otra
    if(this.cuentaOrigen != "" && this.cuentaDestino != ""){
     
      let info = {
        origen: this.cuentaOrigen,
        destino: this.cuentaDestino,
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

  getAccounts(){
    return this.http.get(`http://localhost:8090/account/getnumber/${this.usuario}`).toPromise();
  }

}
