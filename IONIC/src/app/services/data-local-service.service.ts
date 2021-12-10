import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalServiceService {

  usuario: string;

  constructor(private storage: Storage) {
    this.initDB(); 
    this.cargarUsuario();
  }

  private _storage: Storage | null = null;

  async initDB(){
    const storage = await this.storage.create();
    this._storage = storage;
  }

  guardarUsuario(usuario: string){
    
    this.storage.set('Usuario', usuario); 
  }

  async cargarUsuario(){
    const usuario = await this.storage.get('Usuario');
    this.usuario = usuario;
    return this.usuario;
  }
}
