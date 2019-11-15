import { Component } from '@angular/core';
import { /*ToastController,*/ Platform } from '@ionic/angular';
import { InventariosService } from '../inventarios/inventarios.service';
import { Inventario } from '../inventarios/inventario';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  codigoBemManual: number;

  constructor(
    //private toastController: ToastController,
    private toast: Toast,
    private platform: Platform,
    private inventariosService: InventariosService
  ) { }

  async presentToast(mensagem: string) {
    /*const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000
    });
    toast.present();*/
    const toast = this.toast.show(mensagem, '2000', 'center').subscribe();
  }

  marcarBemComoLido(codigoBemLido) {
    const inventario: Inventario = this.inventariosService.inventarioAtual;
    console.log('Inventário atual', inventario);
    console.log('Inserindo bem: ', codigoBemLido);
    if (inventario.bens) {
      const bemLido = this.recuperarBem(codigoBemLido, inventario);
      if (bemLido && bemLido.conferido === false) {
        bemLido.forEach(bem => bem.conferido = true);
        this.presentToast(codigoBemLido + ' - Bem conferido.');
      } else {
        // adicionar bens
        this.adicionarBem(inventario, codigoBemLido);
        this.presentToast(codigoBemLido + ' - Bem adicionado e conferido.');
      }
    } else {
      // primeiro bem
      this.adicionarBem(inventario, codigoBemLido);
      this.presentToast(codigoBemLido + ' - Bem adicionado e conferido.');
    }
    this.inventariosService.salvarInventario(inventario);
  }

  recuperarBem(codigoBem: number, inventario: Inventario) {
    const bensLidos = inventario.bens.filter(i => i.codigo === codigoBem);
    if (bensLidos.length > 0) {
      return bensLidos[0];
    } else {
      return undefined;
    }
  }

  conferirBemManualmente() {
    this.marcarBemComoLido(this.codigoBemManual);
    this.codigoBemManual = undefined;
  }

  adicionarBem(inventario: Inventario, codigoBem: number, lido: boolean = true) {
    if (!inventario.bens) {
      inventario.bens = [];
    }
    inventario.bens.push({ codigo: codigoBem, conferido: lido });
  }
}
