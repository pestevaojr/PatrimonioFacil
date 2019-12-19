import { Component, NgZone } from '@angular/core';

import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { InventariosService } from '../inventarios/inventarios.service';
import { Inventario } from '../inventarios/inventario';
import { Toast } from '@ionic-native/toast/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SairService } from '../services/sair.service';

@Component({
  selector: 'app-leitura',
  templateUrl: 'leitura.page.html',
  styleUrls: ['leitura.page.scss']
})
export class LeituraPage {

  barcodeScannerOptions: BarcodeScannerOptions;
  isCordova: boolean;
  codigoBemManual: number;
  scanCancelado = false;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastController: ToastController,
    private toastNative: Toast,
    private platform: Platform,
    private inventariosService: InventariosService,
    private ngZone: NgZone,
    private dialogs: Dialogs,
    private sairService: SairService
  ) {
    this.isCordova = this.platform.is('cordova');
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
      disableSuccessBeep: false,
      prompt: 'Posicione o código de barras dentro da área clara',
      resultDisplayDuration: 0
    };
  }

  ionViewCanLeave() {
    const podeSair = !this.scanCancelado;
    this.scanCancelado = false;
    return podeSair;
  }

  ionViewWillEnter() {
    console.log('Inicializando o barcode scanner');

    if (this.isCordova && this.scanCancelado === false && !!this.inventarioAtual) {
      this.scanCode();
    }
  }

  ionViewDidEnter() {
    this.sairService.podeSair = this.scanCancelado;
  }

  ionViewWillLeave() {
    this.sairService.podeSair = false;
  }

  scanCode() {
    console.log('Iniciando scan.');
    this.scanCancelado = false;
    this.barcodeScanner
      .scan(this.barcodeScannerOptions)
      .then(async barcodeData => {
        if (barcodeData.cancelled) {
          this.scanCancelado = true;
          this.sairService.podeSair = true;
          this.presentToast('Cancelado');
        } else {
          const codigoBemLido = +barcodeData.text;
          if (this.validarCodigo(codigoBemLido)) {
            this.marcarBemComoLido(codigoBemLido); // cast string para number
          } else {
            this.presentAlert('Código inválido: ' + barcodeData.text, this.scanCode.bind(this));
          }
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  validarCodigo(codigo) {
    if (isNaN(codigo)) {
      return false;
    }
    return true;
  }

  async presentToast(mensagem: string, callback?) {
    if (this.isCordova) {
      if (callback) {
        console.log('Mostrando toast');
        this.toastNative.show(mensagem, '2000', 'center').subscribe(callback.bind(this));
      } else {
        this.toastNative.show(mensagem, '2000', 'center').subscribe((toast) => console.log(toast));
      }
    } else {
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000
      });
      toast.present();
    }
  }

  presentAlert(mensagem: string, callback?) {
    this.dialogs.alert(mensagem, 'Aviso').then(callback);
  }

  async marcarBemComoLido(codigoBemLido: number) {
    const inventario: Inventario = this.inventariosService.inventarioAtual;
    console.log('Inventário atual', inventario);
    console.log('Inserindo bem: ', codigoBemLido);
    let mensagem;
    if (inventario.bens) {
      const bemLido = this.recuperarBem(codigoBemLido, inventario);

      if (bemLido && bemLido.conferido === false) {
        // bem pré-carregado mas ainda não conferido
        bemLido.conferido = true;
        mensagem = codigoBemLido + ' - Bem conferido.';
      } else if (bemLido && bemLido.conferido === true) {
        // bem já conferido
        mensagem = codigoBemLido + ' - Bem já conferido.';
      } else {
        // adicionar bens
        this.adicionarBem(inventario, codigoBemLido);
        mensagem = codigoBemLido + ' - Bem adicionado e conferido.';
      }
    } else {
      // primeiro bem
      this.adicionarBem(inventario, codigoBemLido);
      mensagem = codigoBemLido + ' - Bem adicionado e conferido.';
    }
    this.presentAlert(mensagem, this.scanCode.bind(this));
    this.inventariosService.salvarInventario(inventario);
  }

  recuperarBem(codigoBem: number, inventario: Inventario) {
    // tslint:disable-next-line: triple-equals
    const bensLidos = inventario.bens.filter(i => i.codigo == codigoBem);
    console.log('Recuperando bem código: ', codigoBem, '. Bem: ', bensLidos);
    console.log(bensLidos.length);
    if (bensLidos.length > 0) {
      return bensLidos[0];
    } else {
      return undefined;
    }
  }

  conferirBemManualmente() {
    if (this.codigoBemManual && this.codigoBemManual > 0) {
      this.marcarBemComoLido(this.codigoBemManual);
      this.codigoBemManual = undefined;
    } else {
      this.presentToast('Código do bem inválido');
    }
  }

  adicionarBem(inventario: Inventario, codigoBem: number, lido: boolean = true) {
    if (!inventario.bens) {
      inventario.bens = [];
    }
    inventario.bens.push({ codigo: codigoBem, conferido: lido });
  }

  get inventarioAtual() {
    return this.inventariosService.inventarioAtual;
  }
}
