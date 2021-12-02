import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.page.html',
  styleUrls: ['./inicio-usuario.page.scss'],
})
export class InicioUsuarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  entreCuentas(){
    console.log("entre cuentas");
  }

  aTerceros(){
    console.log("a terceros");
  }

  transacciones(){
    console.log("transacciones");
  }

  changePassword(){
    console.log("change password");
  }
}
