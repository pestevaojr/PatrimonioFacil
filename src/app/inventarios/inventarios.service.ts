import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Inventario } from './inventario';

const KEY_INVENTARIOS = 'inventarios';
const KEY_INVENTARIO_ATIVO = 'inventario_ativo';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  inventarios: Inventario[] = [];
  inventarioAtivo: Inventario;


  constructor(private _storage: Storage) {
    this.carregarInventarios();
  }

  carregarInventarioAtivo() {
    this.inventarioAtivo = null;
    this._storage.get(KEY_INVENTARIO_ATIVO).then(inventarioAtivo => {
      if (inventarioAtivo) {
        this.inventarioAtivo = inventarioAtivo;
      } else if (this.inventarios.length > 0) {
        this.inventarios.sort((i1, i2) => i2.dataCriacao.getMilliseconds() - i1.dataCriacao.getMilliseconds());
        console.log(this.inventarios);
        this.inventarioAtivo = this.inventarios[0];
      }
    });
  }

  carregarInventarios() {
    this._storage.get(KEY_INVENTARIOS).then(
      inventarios => {
        console.log('Obtendo inventários de IndexedDB');
        if (inventarios) {
          this.inventarios = inventarios;
        } else {
          this.inventarios = [];
        }

        this.carregarInventarioAtivo();
      }
    );
  }

  salvarInventario(inventario: Inventario) {
    this.inventarios.push(inventario);
    this.persistirInventarios();
  }

  persistirInventarios() {
    this._storage.set(KEY_INVENTARIOS, this.inventarios);
    this._storage.set(KEY_INVENTARIO_ATIVO, this.inventarioAtivo);
  }

  excluirInventario(inventario: Inventario) {

  }

  obterInventarios() {
    return this.inventarios;
  }
}
