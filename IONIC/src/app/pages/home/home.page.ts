import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = "";
  password: string = "";
  isUser: boolean = true;
  info: any;
  correct: boolean = false;

  constructor(private route: Router,
              private toastCtrl: ToastController,
              private http: HttpClient) {}

  verificarUsuario(){
    var usuario = this.username;
    var contraseña = this.password;
    this.getUser().then(
      (res: User) =>{
        this.info = res;
        console.log(usuario);
        if(usuario == "admin" && contraseña == "123"){
          this.username = "";
          this.password = "";
          this.isUser = false;
          this.route.navigate(['/inicio-admin']);
        }
        else if(this.info[0].Usuario === usuario && this.info[0].Contraseña === contraseña){  
          this.route.navigate(['/inicio-usuario']);
        }
        else{
          this.presentToast("Usuario o contraseña incorrectos, inténtelo de nuevo");
        }
      }
    );
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  getUser(){
    return this.http.get(`http://localhost:8090/users/${this.username}`).toPromise();
  };
}