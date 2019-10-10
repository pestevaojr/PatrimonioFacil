import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Inventario } from './inventario';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  inventarios = [];

  constructor(private storage: Storage) {
    this.carregarInventarios();
  }

  carregarInventarios() {
    this.storage.get('inventarios').then(
      inventarios => this.inventarios = inventarios
    );
  }

  salvarInventario(inventario: Inventario) {
    this.inventarios.push(inventario);
    this.storage.set('inventarios', this.inventarios);
  }

  excluirInventario(inventario: Inventario) {

  }
}
