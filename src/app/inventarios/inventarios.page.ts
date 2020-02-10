import { Component } from '@angular/core';
import { InventariosService } from './inventarios.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Toast } from '@ionic-native/toast/ngx';
import { SairService } from '../services/sair.service';

@Component({
  templateUrl: 'inventarios.page.html',
  styleUrls: ['inventarios.page.scss']
})
export class InventariosPage {

  constructor(
    private service: InventariosService,
    private router: Router,
    private platform: Platform,
    private toast: Toast,
    private sairService: SairService
  ) { 
    console.log('Construtor inventarios page');
    this.service.carregarInventarios();
  }

  ngOnInit() {
    console.log('iniciou inventarios page');
  }

  ionViewDidEnter() {
    this.sairService.podeSair = true;
    console.log('Entrou inventarios page');
  }

  ionViewWillLeave() {
    this.sairService.podeSair = false;
    console.log('Saindo da página de inventários');
  }

  get inventarios() {
    return this.service.obterInventarios();
  }

  abrirDetalhesInventario(inventario) {
    const navigationExtras: NavigationExtras = {
      state: { inventario }
    };
    this.router.navigate(['tabs/inventarios/inventario-detalhes'], navigationExtras);
  }

  abrirNovoInventario() {
    this.router.navigate(['tabs/inventarios/inventario-novo']);
  }
}
