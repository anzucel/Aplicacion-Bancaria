import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.page.html',
  styleUrls: ['./inicio-usuario.page.scss'],
})
export class InicioUsuarioPage implements OnInit {

  cuentasUsuario: any[] = [];
  nuevaPassword: string = "";

  constructor(private route: Router,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    //recuperar todas las cuentas del usuario para mostrarlas en la pagina principal 
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
}
