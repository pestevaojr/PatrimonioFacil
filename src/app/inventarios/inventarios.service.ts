import { Injectable } from '@angular/core';
import { Inventario } from './inventario';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  inventarios: Inventario[] = [];
  inventarioAtual: Inventario;
  inventariosIdentity: number;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationService
  ) {
    console.log('Construtor Inventários Service');
    this.carregarInventarios();
  }

  carregarInventarioAtual(inventarios) {
    const atuais = inventarios.filter(i => i.atual === true);
    this.inventarioAtual = atuais && atuais.length > 0 ? atuais[0] : this.inventarios[0];
    console.log('Carregando inventário atual: ', this.inventarioAtual);
  }

  carregarInventarios() {
    console.log('Entrou no carregarInventarios()');
    console.log('User details: ', this.authService.userDetails());

    this.firestore.collection('inventarios',
      ref => ref.where('uid', '==', this.authService.userDetails().uid)
    ).snapshotChanges().subscribe(
      data => {
        const inventarios = this.mapearFirebaseParaInventarios(data);
        this.inventarios = this.ordenarInventarios(inventarios);
        this.carregarInventarioAtual(this.inventarios);
        console.log('Inventários carregados.', this.inventarios);
      }, (err) => console.log(err));
  }

  mapearFirebaseParaInventarios(firebaseData) {
    console.log('Dados do Firebase ', firebaseData);

    const inventarios = firebaseData.map(e => {
      return {
        id: e.payload.doc.id,
        nome: e.payload.doc.data()['nome'],
        dataCriacao: e.payload.doc.data()['dataCriacao'].toDate(),
        atual: e.payload.doc.data()['atual'],
        bens: e.payload.doc.data()['bens'],
        uid: e.payload.doc.data()['uid'],
        localizacao: e.payload.doc.data()['localizacao']
      };
    });
    return inventarios;
  }

  ordenarInventarios(inventarios) {
    const inventariosOrdenados = inventarios.sort((i1, i2) => {
      if (i1.atual === true) {
        return -1;
      } else if (i2.atual === true) {
        return 1;
      } else {
        return i1.dataCriacao.getMilliseconds() - i2.dataCriacao.getMilliseconds();
      }
    });
    return inventariosOrdenados;
  }

  definirInventarioAtual(novoInventarioAtual) {
    const antigoInventarioAtual = this.inventarioAtual;
    if (antigoInventarioAtual) {
      antigoInventarioAtual.atual = false;
      this.atualizarInventario(antigoInventarioAtual);
    }
    // tornar o novo atual
    novoInventarioAtual.atual = true;
    this.atualizarInventario(novoInventarioAtual);
    return novoInventarioAtual;
  }

  async salvarInventario(inventarioParaSalvar: Inventario) {
    console.log('Salvando inventário ', inventarioParaSalvar);
    if (inventarioParaSalvar.id) {
      // atualizar
      this.atualizarInventario(inventarioParaSalvar);
    } else {
      // novo

      // tornar o novo atual
      const inventarioAtual = this.inventarioAtual;
      inventarioParaSalvar.atual = true;
      await this.inserirInventario(inventarioParaSalvar);

      console.log('Salvar inventário - inventário novo inserido');

      if (inventarioAtual) {
        inventarioAtual.atual = false;
        await this.atualizarInventario(inventarioAtual);
      }

    }
  }

  async inserirInventario(inventario) {
    inventario.uid = this.authService.userDetails().uid;
    console.log('Inserindo inventário: ', inventario);
    return this.firestore.collection('inventarios').add(inventario).then(
      (res) => {
        console.log('Inventário inserido com sucesso. Id: ', res.id);
        inventario.id = res.id;
      },
      (err) => console.log('Erro ao inserir inventário', err)
    );
  }

  async atualizarInventario(inventario: Inventario) {
    console.log('Atualizando inventário: ', inventario);
    await this.firestore.doc('inventarios/' + inventario.id).update(inventario);
  }

  excluirInventario(inventario: Inventario) {
    this.firestore.doc('inventarios/' + inventario.id).delete();
    const inventariosRestantes = this.ordenarInventarios(
      this.inventarios.filter(i => inventario.id !== i.id)
    );
    if (inventariosRestantes.length > 0) {
      const atual = inventariosRestantes[0];
      atual.atual = true;
      this.atualizarInventario(atual);
    }
  }

  obterInventarios() {
    return this.inventarios;
  }

  inventarioPorId(id) {
    const inventario = this.inventarios.filter((i) => i.id == id);
    if (inventario.length > 0) {
      return inventario[0];
    }
    return undefined;
  }
}
