import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cuenta-tercera',
  templateUrl: './cuenta-tercera.component.html',
  styleUrls: ['./cuenta-tercera.component.scss'],
})
export class CuentaTerceraComponent implements OnInit {

  @Input() username;
  usernameTercero: string = "";
  cuentaTercero: string = "";

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    //console.log(this.username);
  }

  agregarCuentaTercera(){
    console.log(this.username, this.usernameTercero, this.cuentaTercero)
    //agregar nueva cuenta tercera
    /* let info = {
      user: this.username,
      Tuser: this.usernameTercero,
      numberAccount: this.cuentaTercero
    }
    
    this.http.post(`http://localhost:8090/account/addTAccount`, info)
    .subscribe(response =>{
      console.log('post response', response);
      this.presentToast(response[0].Mensaje);
      }
    );   */
  }

  borrarCuentaTercera(){
    //agregar nueva cuenta tercera
    let info = {
      user: this.username,
      Tuser: this.usernameTercero,
      numberAccount: this.cuentaTercero
    }
    
    this.http.post(`http://localhost:8090/account/deleteTAccount`, info)
    .subscribe(response =>{
      console.log('post response', response);
      this.presentToast(response[0].Mensaje);
      }
    );
  } 

  cerrar(){
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500
    });
    toast.present();
  }
}
