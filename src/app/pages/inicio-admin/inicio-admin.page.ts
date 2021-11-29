import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
})
export class InicioAdminPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  crearCuenta(){
    console.log("crear usuario");
    this.route.navigate(['/crear-usuario']);
  }

  bloquearCuenta(){
    console.log("bloquear cuenta");
    this.route.navigate(['/bloquear-cuenta']);
  }

  acreditarCuenta(){
    console.log("acreditar a una cuenta");
    this.route.navigate(['/acreditar-cuenta']);
  }
}
