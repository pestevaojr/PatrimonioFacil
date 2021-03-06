import { Component, OnInit } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { NavController, Platform, ToastController, LoadingController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';

import { Toast } from '@ionic-native/toast/ngx';
import * as XLSX from 'xlsx';
import { Bem } from '../bem';
import { Inventario } from '../inventario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventario-novo',
  templateUrl: './inventario-novo.page.html',
  styleUrls: ['./inventario-novo.page.scss'],
})
export class InventarioNovoPage implements OnInit {

  bens: Bem[] = [];
  formNovoInventario: FormGroup;
  errorMessage = '';
  successMessage = '';

  isCordova: boolean;

  loading;

  constructor(
    private service: InventariosService,
    private navController: NavController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private platform: Platform,
    private toastController: ToastController,
    private toastNative: Toast,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.isCordova = this.platform.is('cordova');

    this.formNovoInventario = this.formBuilder.group({
      nome: ['', Validators.required],
      localizacao: ['']
    });

    this.loading = await this.loadingController.create({
      message: 'Aguarde...'
    });
  }

  async salvar(formValue) {
    if (this.formNovoInventario.valid) {
      const nome = formValue.nome;
      let localizacao = formValue.localizacao;
      if (localizacao == undefined || localizacao.length == 0) {
        localizacao = null;
      }
      const novoInventario = {
        nome: nome,
        dataCriacao: new Date(),
        bens: this.bens,
        localizacao: localizacao
      };

      await this.presentLoading();
      await this.service.salvarInventario(novoInventario);
      await this.dismissLoading();
      
      this.navController.navigateRoot('/tabs/inventarios');      
    } else {
      this.errorMessage = 'O nome é obrigatório!';
    }
  }

  importarBens() {
    const excelMimetype = { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

    this.fileChooser.open(excelMimetype).then(fileuri => {
      this.filePath.resolveNativePath(fileuri).then(resolvedNativePath => {
        const fileName = resolvedNativePath.substring(resolvedNativePath.lastIndexOf('/') + 1);
        const directory = resolvedNativePath.substring(0, resolvedNativePath.lastIndexOf('/'));
        this.file.readAsBinaryString(directory, fileName).then((data) => {
          const bstr: string = data;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          const excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.bens = this.converterExcelParaBens(excelData);
        }).catch(err => {
          this.presentToast('Erro ao ler arquivo.');
        });
      });
    });
  }

  converterExcelParaBens(excelData: any[]) {
    let primeiraLinha = true;
    let cabecalho = [];
    const bens = [];
    excelData.forEach((linha: any[]) => {
      if (primeiraLinha) {
        cabecalho = linha;
      } else {
        const bem: Bem = {
          codigo: linha[0],
          importado: true,
          conferido: false
        };
        if (linha.length > 1) {
          bem.descricao = linha[1];
        }
        const dadosImportados = {};
        cabecalho.forEach((titulo, indice) => {
          dadosImportados[titulo] = linha[indice];
        });

        bem.dadosImportados = dadosImportados;

        bens.push(bem);
      }
      primeiraLinha = false;
    });
    return bens;
  }

  async presentToast(mensagem: string) {
    if (this.isCordova) {
      this.toastNative.show(mensagem, '2000', 'center').subscribe();
    } else {
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000
      });
      toast.present();
    }
  }

  async presentLoading() {
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

}
