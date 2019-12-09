import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Inventario } from '../inventario';
import { Bem } from '../bem';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { InventariosService } from '../inventarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inventario-detalhes',
  templateUrl: './inventario-detalhes.page.html',
  styleUrls: ['./inventario-detalhes.page.scss'],
})
export class InventarioDetalhesPage implements OnInit {

  inventario: Inventario;
  grafico: GoogleChartInterface;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: InventariosService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inventario = this.router.getCurrentNavigation().extras.state.inventario;
      }
    });

    this.criarGrafico();
  }

  criarGrafico() {
    this.grafico = {
      chartType: 'PieChart',
      dataTable: [
        ['Bens', 'Quantidade de bens'],
        ['Conferidos', this.qtdeBensConferidos],
        ['Não conferidos', this.qtdeTotalBens - this.qtdeBensConferidos]
      ],
      options: {
        title: 'Bens',
        width: '100%',
        colors: ['green', 'red'],
        pieHole: 0.4,
        legend: 'top'
      },
    };
  }

  abrirListaBens() {
    const navigationExtras: NavigationExtras = {
      state: { bens: this.inventario.bens }
    };
    this.router.navigate(['tabs/inventarios/bens'], navigationExtras);
  }

  tornarAtual() {
    this.inventario = this.service.definirInventarioAtual(this.inventario);
  }

  excluirInventario() {
    this.service.excluirInventario(this.inventario).then(
      () => this.navCtrl.navigateBack('tabs/inventarios')
    );

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
