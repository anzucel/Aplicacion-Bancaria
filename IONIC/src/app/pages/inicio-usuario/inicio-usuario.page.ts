import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';
import { Cuenta } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.page.html',
  styleUrls: ['./inicio-usuario.page.scss'],
})
export class InicioUsuarioPage implements OnInit {

  cuentasUsuario: any[] = [];
  nuevaPassword: string = "";
  usuario: any;

  constructor(private route: Router,
              private toastCtrl: ToastController,
              private DataService :DataLocalServiceService,
              private http: HttpClient) { }

  ngOnInit() {
    //recuperar todas las cuentas del usuario para mostrarlas en la pagina principal 
    this.DataService.cargarUsuario().then(
      (resp: string) =>{
        this.usuario = resp;
        console.log('Resp' + this.usuario);
        this.getAccounts().then(
          (res: any) => {
            this.cuentasUsuario.push(...res);
            //console.log(this.cuentasUsuario);
          }
        );
      }
    );
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

  transacciones(){
    this.route.navigate(['/historial']);
    console.log("transacciones");
  }

  changePassword(){
    console.log("change password");
    // comprobar si si es la contrase;a actual y actualizarla
    this.presentToast("Se ha actualizado la contraseña");
    this.nuevaPassword = "";

  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  getAccounts(){
    return this.http.get(`http://localhost:8090/account/get/${this.usuario}`).toPromise();
  }
}
