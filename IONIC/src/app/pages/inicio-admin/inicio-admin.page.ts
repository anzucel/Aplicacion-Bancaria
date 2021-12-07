import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
})
export class InicioAdminPage {

  numeroCuenta: string = "";
  cantidadAcreditar: string = "";
  mensaje = "";
  
  constructor(private route: Router,
              private toastCtrl: ToastController,
              private http: HttpClient) { } 

  crearCuenta(){
    console.log("crear usuario");
    this.route.navigate(['/crear-usuario']);
  }

  agregarServicio(){
    //con el numero de cuenta agregar el servicio de cuenta de ahorro
    console.log("agregar servicio");
    
    if(this.numeroCuenta != ""){
      let info = {
        accountNumber: this.numeroCuenta,
      }
  
      this.http.post('http://localhost:8090/account/create', info)
        .subscribe(response =>{
          console.log('post response', response);
          this.mensaje = response[0].Mensaje;
          this.presentToast(response[0].Mensaje);
        }); 
      
        this.numeroCuenta = ""; 
    }
    else{
      this.presentToast("Ingrese número de cuenta");
    }
  }

  bloquearCuenta(){
    //bloquear cuenta con el numero de cuenta
    console.log("bloquear cuenta");
    if(this.numeroCuenta != ""){
      let info = {
        accountNumber: this.numeroCuenta,
      }
  
      this.http.post('http://localhost:8090/account/block', info)
        .subscribe(response =>{
          console.log('post response', response);
          this.mensaje = response[0].Mensaje;
          this.presentToast(response[0].Mensaje);
        }); 
      
        this.numeroCuenta = ""; 
    }
    else{
      this.presentToast("Ingrese número de cuenta");
    }
  }

  acreditarCuenta(){

    if(this.cantidadAcreditar == ""){
      this.presentToast("Ingrese una cantidad para acreditar a la cuenta");
    }else{
      let info = {
        accountNumber: this.numeroCuenta,
        amount: this.cantidadAcreditar
      }
 
      this.http.post(`http://localhost:8090/account/accredit`, info)
      .subscribe(response =>{
        console.log('post response', response);
        this.presentToast(response[0].Mensaje);
      });

      this.numeroCuenta = "";
      this.cantidadAcreditar = "";
    }

    console.log("acreditar a una cuenta");
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }
}
