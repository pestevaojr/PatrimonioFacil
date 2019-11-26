import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventario } from '../inventario';
import { Bem } from '../bem';

@Component({
  selector: 'app-inventario-detalhes',
  templateUrl: './inventario-detalhes.page.html',
  styleUrls: ['./inventario-detalhes.page.scss'],
})
export class InventarioDetalhesPage implements OnInit {

  inventario: Inventario;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inventario = this.router.getCurrentNavigation().extras.state.inventario;
      }
    });
  }

  get bensConferidos(): Bem[] {
    if (this.inventario) {
      return this.inventario.bens.filter(bem => bem.conferido);
    }
    return [];
  }

  get qtdeBensConferidos() {
    return this.bensConferidos.length;
  }

  get todosBens(): Bem[] {
    if (this.inventario) {
      return this.inventario.bens;
    }
    return [];
  }

  get qtdeTotalBens() {
    return this.todosBens.length;
  }
}
