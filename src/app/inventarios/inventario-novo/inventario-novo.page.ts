import { Component, OnInit } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { NavController } from '@ionic/angular';
import { InventariosPage } from '../inventarios.page';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-inventario-novo',
  templateUrl: './inventario-novo.page.html',
  styleUrls: ['./inventario-novo.page.scss'],
})
export class InventarioNovoPage implements OnInit {

  nome: string;
  path: string;
  localizacao: string;

  constructor(
    private service: InventariosService,
    private navController: NavController,
    private fileChooser: FileChooser,
    private filePath: FilePath
  ) { }

  ngOnInit() {
  }

  salvar() {
    if (this.nome && this.nome.length > 0) {
      this.service.salvarInventario({nome: this.nome, dataCriacao: new Date(), bens: [], localizacao: this.localizacao});
      this.navController.navigateRoot('/tabs/inventarios');
    }
  }

  importarBens() {
    this.fileChooser.open().then(fileuri => {
      this.filePath.resolveNativePath(fileuri).then(resolvedNativePath => {
        this.path = resolvedNativePath;
      });
    });
  }
}
