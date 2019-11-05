import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { InventariosService } from './inventarios.service';

@Component({
  templateUrl: 'inventarios.page.html',
  styleUrls: ['inventarios.page.scss']
})
export class InventariosPage {

  constructor(private service: InventariosService) {}

  get inventarios() {
    return this.service.obterInventarios();
  }
}
