import { Component, Input, OnInit } from '@angular/core';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  transacciones: any[] = [];
  usuario: any;

  constructor(private DataService: DataLocalServiceService,
              private http: HttpClient) { }

  ngOnInit() {
    //recuperar todas las transacciones para mostrar en el historial
    this.DataService.cargarUsuario().then(
      (resp: string) =>{
        this.usuario = resp;
        console.log('Resp' + this.usuario);
        this.getHistorial().then(
          (res: any) => {
            this.transacciones = res;
            console.log(this.transacciones);
          }
        );
      }
    );
  }

  getHistorial(){
    return this.http.get(`http://localhost:8090/account/gethistorial/${this.usuario}`).toPromise();
  }
}
