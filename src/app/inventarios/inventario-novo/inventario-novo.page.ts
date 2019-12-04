import { Component, OnInit } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';

import { Toast } from '@ionic-native/toast/ngx';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-inventario-novo',
  templateUrl: './inventario-novo.page.html',
  styleUrls: ['./inventario-novo.page.scss'],
})
export class InventarioNovoPage implements OnInit {

  nome: string;
  localizacao: string;

  path: string;
  fileuri: string;
  file2: any;
  fileName: string;
  directory: string;
  excel: any[];

  isCordova: boolean;

  constructor(
    private service: InventariosService,
    private navController: NavController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private platform: Platform,
    private toastController: ToastController,
    private toastNative: Toast,
  ) { }

  ngOnInit() {
    this.isCordova = this.platform.is('cordova');
  }

  salvar() {
    if (this.nome && this.nome.length > 0) {
      this.service.salvarInventario({ nome: this.nome, dataCriacao: new Date(), bens: [], localizacao: this.localizacao });
      this.navController.navigateRoot('/tabs/inventarios');
    }
  }

  importarBens() {
    const excelMimetype = { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

    this.fileChooser.open(excelMimetype).then(fileuri => {
      this.fileuri = fileuri;
      this.filePath.resolveNativePath(fileuri).then(resolvedNativePath => {
        this.path = resolvedNativePath;
        this.fileName = resolvedNativePath.substring(resolvedNativePath.lastIndexOf('/') + 1);
        this.directory = resolvedNativePath.substring(0, resolvedNativePath.lastIndexOf('/'));
        this.file.readAsBinaryString(this.directory, this.fileName).then((data) => {
          this.presentToast('Entrou no then.');
          const bstr: string = data;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          this.excel = XLSX.utils.sheet_to_json(ws, { header: 1 });
        }).catch(err => {
          this.presentToast('Erro ao ler arquivo.');
        });
      });
    });
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
}
