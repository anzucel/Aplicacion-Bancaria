import { Component, OnInit, Input } from '@angular/core';
import { DataLocalServiceService } from '../../services/data-local-service.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {

  @Input() cuenta;
  @Input() username;
  transacciones: any[] = []; 

  constructor(private DataService: DataLocalServiceService,
              private modalCtrl: ModalController,
              private http: HttpClient) { }

  ngOnInit() {this.getTransacciones()}

  getTransacciones(){
    console.log(this.cuenta, this.username);
    console.log(this.transacciones);
    this.getHistorial().then(
      (res: any) => {
        this.transacciones = res;
        console.log(this.transacciones);
      }
    );
  }

  cerar(){
    this.modalCtrl.dismiss();
  }

  getHistorial(){
    return this.http.get(`http://localhost:8090/account/gethistorial/${this.username}/${this.cuenta}`).toPromise();
  }
}
