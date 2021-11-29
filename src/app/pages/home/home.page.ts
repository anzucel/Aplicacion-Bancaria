import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = "";
  password: string = "";
  isUser: boolean = false;

  constructor(private route: Router,
              private toastCtrl: ToastController) {}

  verificarUsuario(){
    console.log(this.username, this.password);
    //verificar en la base de datos y redirigir a la pagina correspondiente

    if(this.username == "admin" && this.password == "123"){
      this.username = "";
      this.password = "";
      this.route.navigate(['/inicio-admin']);
    } 
    else if(this.isUser){
      this.username = "";
      this.password = "";
      this.route.navigate(['/inicio-usuario']);
    }
    else{
      this.username = "";
      this.password = "";
      this.presentToast("Usuario o contraseña incorrectos, inténtelo de nuevo");
    }
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

}
