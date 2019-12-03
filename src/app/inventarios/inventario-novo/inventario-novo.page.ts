import { Component, OnInit } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { NavController } from '@ionic/angular';
import { InventariosPage } from '../inventarios.page';

@Component({
  selector: 'app-inventario-novo',
  templateUrl: './inventario-novo.page.html',
  styleUrls: ['./inventario-novo.page.scss'],
})
export class InventarioNovoPage implements OnInit {

  nome: string;
  localizacao: string;

  constructor(private service: InventariosService, private navController: NavController) { }

  ngOnInit() {
  }

  salvar() {
    if (this.nome && this.nome.length > 0) {
      this.service.salvarInventario({nome: this.nome, dataCriacao: new Date(), bens: [], localizacao: this.localizacao});
      this.navController.navigateRoot('/tabs/inventarios');
    }
  }

}
