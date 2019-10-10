import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { InventariosService } from './inventarios.service';

@Component({
  templateUrl: 'inventarios.page.html',
  styleUrls: ['inventarios.page.scss']
})
export class InventariosPage {

  constructor(private service: InventariosService) {
    this.service.salvarInventario({ nome: 'inventario1'});
    this.service.salvarInventario({ nome: 'inventario2'});
  }

  get inventarios() {
    return this.service.inventarios;
  }
}
