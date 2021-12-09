import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cuenta-tercera',
  templateUrl: './cuenta-tercera.component.html',
  styleUrls: ['./cuenta-tercera.component.scss'],
})
export class CuentaTerceraComponent implements OnInit {

  @Input() username;
  usernameTercero: string = "";
  cuentaTercero: string = "";

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.username);
  }

  agregarCuentaTercera(){
    //agregar nueva cuenta tercera
    console.log(this.usernameTercero, this.cuentaTercero);
  }

  borrarCuentaTercera(){
    //agregar nueva cuenta tercera
    console.log(this.usernameTercero, this.cuentaTercero);
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }
  

}
