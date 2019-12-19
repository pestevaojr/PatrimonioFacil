import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Inventario } from '../inventario';
import { Bem } from '../bem';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { InventariosService } from '../inventarios.service';
import { NavController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';

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
    private navCtrl: NavController,
    private dialogs: Dialogs
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inventario = this.router.getCurrentNavigation().extras.state.inventario;
        console.log('Carregando parâmetros: ', this.inventario);
      }
    });
  }

  carregarInventario(id) {
    return this.service.inventarioPorId(id);
  }
  
  ionViewWillEnter() {
    this.inventario = this.carregarInventario(this.inventario.id);
    console.log('Abrindo inventário: ', this.inventario);
    this.criarGrafico();    
    console.log('url', this.router.url);
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
      state: { idInventario: this.inventario.id }
    };
    this.router.navigate(['tabs/inventarios/bens', ], navigationExtras);
  }

  tornarAtual() {
    this.inventario = this.service.definirInventarioAtual(this.inventario);
  }

  async excluirInventario() {
    this.dialogs.confirm('Deseja realmente excluir o inventário?', this.inventario.nome, ['Sim', 'Não']).then(botao => {
      if (botao == 1) {
        this.service.excluirInventario(this.inventario);
        this.navCtrl.navigateBack('tabs/inventarios');
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
