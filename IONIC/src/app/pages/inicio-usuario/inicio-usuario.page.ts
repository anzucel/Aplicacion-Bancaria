import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';
import { Cuenta } from 'src/app/interfaces/interfaces';
import { CuentaTerceraComponent } from '../../components/cuenta-tercera/cuenta-tercera.component';
import { NgZone } from '@angular/core';
import { HistorialComponent } from '../../components/historial/historial.component';
@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.page.html',
  styleUrls: ['./inicio-usuario.page.scss'],
})
export class InicioUsuarioPage implements OnInit {

  cuentasUsuario: Cuenta[] = [];
  nuevaPassword: string = "";
  usuarioTercero: string = "";
  cuentaTercero: string = "";
  usuario: any;

  constructor(private route: Router,
              private toastCtrl: ToastController,
              private DataService :DataLocalServiceService,
              private http: HttpClient,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private zone: NgZone) { }

 ngOnInit() {
 }

  ionViewDidEnter(){
    this.getData();
  }

  getData(){
    this.DataService.cargarUsuario().then(
      (resp: string) =>{
        this.usuario = resp;
        console.log('Resp ' + this.usuario);  
        this.getAccounts().then(
          (res: any) => {
            this.cuentasUsuario.push(...res);
            console.log(this.cuentasUsuario);
          }
        );
      }
    );
  }

  refresh() {
    this.zone.run(() => {
      console.log('force update the screen');
    });
  }

  entreCuentas(){
    this.route.navigate(['/transferencia-propia']);
    //hacer transferencia a cuenta propia
    console.log("entre cuentas");
  }

  aTerceros(){
    this.route.navigate(['/transferencia-terceros']);
    //hacer la transferencia a la cuenta tercera  
    console.log("a terceros");
  }

  async manejarTerceros(){
    const modal = await this.modalCtrl.create(
      {
        component: CuentaTerceraComponent,
        componentProps:{
          username: this.usuario 
        }
      });
      modal.present();
  }

  async verHistorial(Nocuenta){
    console.log(Nocuenta);
    const modal = await this.modalCtrl.create(
      {
        component: HistorialComponent,
        componentProps:{
          cuenta: Nocuenta,
          username: this.usuario
        }
      });
      modal.present();
  }

  changePassword(){
    console.log("change password");
    // comprobar si si es la contrase;a actual y actualizarla
    if(this.nuevaPassword != ""){
      let info = {
        password: this.nuevaPassword,
        user: this.usuario
      }

      this.http.post(`http://localhost:8090/account/changePassword`, info)
        .subscribe(response =>{
          console.log('post response', response);
          this.presentToast(response[0].Mensaje);
        }
      ); 
    }
    else{
      this.presentToast("Ingrese una contraseña");
    }
    this.nuevaPassword = "";
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  cerrarSesion(event){
    this.cuentasUsuario = [];
  }

  getAccounts(){
    return this.http.get(`http://localhost:8090/account/get/${this.usuario}`).toPromise();
  }
}
