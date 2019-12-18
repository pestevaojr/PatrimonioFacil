import { Component, OnInit } from '@angular/core';
import { Bem } from '../bem';
import { Router, ActivatedRoute } from '@angular/router';
import { InventariosService } from '../inventarios.service';

@Component({
  selector: 'app-bens',
  templateUrl: './bens.page.html',
  styleUrls: ['./bens.page.scss'],
})
export class BensPage implements OnInit {

  idInventario: string;
  bens: Bem[] = [];
  bensLista: Bem[] = [];
  filtro = 'conferidos';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private service: InventariosService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.idInventario = this.router.getCurrentNavigation().extras.state.idInventario;
        console.log('Carregando parâmetro idInventario: ', this.idInventario);
      }
    });
  }

  ionViewWillEnter() {
    this.bens = this.carregarBens(this.idInventario);
    this.aplicarFiltro(this.filtro);
  }

  carregarBens(idInventario) {
    const inventario = this.service.inventarioPorId(idInventario);
    return inventario.bens || [];
  }

  filtrarBens(event) {
    console.log(event);
    this.filtro = event.target.value;
    this.aplicarFiltro(this.filtro);
  }

  aplicarFiltro(filtro) {
    if (filtro === 'conferidos') {
      this.bensLista = this.bensConferidos;
    } else if (filtro === 'nao-conferidos') {
      this.bensLista = this.bensNaoConferidos;
    } else {
      this.bensLista = this.todosBens;
    }
  }

  get bensConferidos(): Bem[] {
    return this.bens.filter(bem => bem.conferido);
  }

  get qtdeBensConferidos() {
    return this.bensConferidos.length;
  }

  get todosBens(): Bem[] {
    return this.bens;
  }

  get qtdeTotalBens() {
    return this.todosBens.length;
  }

  get bensNaoConferidos(): Bem[] {
    return this.bens.filter(bem => !bem.conferido);
  }
}
