import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventariosPage } from './inventarios.page';
import { InventarioNovoPage } from './inventario-novo/inventario-novo.page';
import { InventarioDetalhesPage } from './inventario-detalhes/inventario-detalhes.page';
import { BensPage } from './bens/bens.page';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2GoogleChartsModule,
    RouterModule.forChild([
      { path: '', component: InventariosPage },
      { path: 'inventario-novo', component: InventarioNovoPage },
      { path: 'inventario-detalhes', component: InventarioDetalhesPage },
      { path: 'bens', component: BensPage }
    ])
  ],
  declarations: [
    InventariosPage,
    InventarioNovoPage,
    InventarioDetalhesPage,
    BensPage
  ]
})
export class InventariosPageModule { }
