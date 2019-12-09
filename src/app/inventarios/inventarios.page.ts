import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { InventariosService } from './inventarios.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';

@Component({
  templateUrl: 'inventarios.page.html',
  styleUrls: ['inventarios.page.scss']
})
export class InventariosPage {

  constructor(
    private service: InventariosService,
    private router: Router
    ) {}

  get inventarios() {
    return this.service.obterInventarios();
  }

  abrirDetalhesInventario(inventario) {
    const navigationExtras: NavigationExtras = {
      state: { inventario }
    };
    this.router.navigate(['tabs/inventarios/inventario-detalhes'], navigationExtras);
  }
}
