import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Inventario } from './inventario';

const KEY_INVENTARIOS = 'inventarios';
const KEY_INVENTARIOS_IDENTITY = 'inventariosIdentity';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  inventarios: Inventario[] = [];
  inventarioAtual: Inventario;
  inventariosIdentity: number;

  constructor(private _storage: Storage) {
    this.carregarInventarios();
  }

  carregarInventarioAtual(inventarios) {
    const atuais = inventarios.filter(i => i.atual === true);
    this.inventarioAtual = atuais && atuais.length > 0 ? atuais[0] : this.inventarios[0];
    this.inventarioAtual.atual = true;
  }

  carregarInventarios() {
    this._storage.get(KEY_INVENTARIOS).then(
      inventarios => {
        console.log('Obtendo inventários de IndexedDB');
        if (inventarios) {
          console.log('Ordenando inventários');
          this.inventarios = this.ordenarInventarios(inventarios);
        } else {
          this.inventarios = [];
        }

        this.carregarInventarioAtual(this.inventarios);
        this.carregarInventariosIdentity();
      }
    );
  }

  carregarInventariosIdentity() {
    this._storage.get(KEY_INVENTARIOS_IDENTITY).then(
      inventariosIdentity => {
        console.log('Obtendo inventários identity de IndexedDB');
        if (inventariosIdentity) {
          this.inventariosIdentity = inventariosIdentity;
        } else {
          this.inventariosIdentity = 0;
        }
      }
    );
  }

  ordenarInventarios(inventarios) {
    const inventariosOrdenados = inventarios.sort((i1, i2) => {
      if (i1.atual === true) {
        return -1;
      } else if  (i2.atual === true) {
        return 1;
      } else {
        return i2.dataCriacao.getMilliseconds() - i1.dataCriacao.getMilliseconds();
      }
    });
    return inventariosOrdenados;
  }

  salvarInventario(inventarioParaSalvar: Inventario) {
    if (inventarioParaSalvar.idLocal) {
      // atualizar
      const inventarioPersistido = this.inventarios.filter(i => i.idLocal === inventarioParaSalvar.idLocal);
      this.replicarPropriedades(inventarioParaSalvar, inventarioPersistido[0]);
    } else {
      // novo
      // tornar o novo atual
      this.inventarios.forEach(i => i.atual = false);
      inventarioParaSalvar.idLocal = ++this.inventariosIdentity;
      inventarioParaSalvar.atual = true;
      this.inventarios.push(inventarioParaSalvar);
    }
    this.inventarios = this.ordenarInventarios(this.inventarios);
    this.persistirInventarios();
  }

  replicarPropriedades(origem: Inventario, destino: Inventario) {
    destino.nome = origem.nome;
    destino.bens = origem.bens;
    destino.atual = origem.atual;
    destino.idRemoto = origem.idRemoto;
    destino.dataCriacao = origem.dataCriacao;
  }

  persistirInventarios() {
    this._storage.set(KEY_INVENTARIOS, this.inventarios);
  }

  excluirInventario(inventario: Inventario) {

  }

  obterInventarios() {
    return this.inventarios;
  }
}
