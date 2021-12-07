import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  transacciones: any[] = [];

  constructor() { }

  ngOnInit() {
      //recuperar todas las transacciones para mostrar en el historial
  }

}
