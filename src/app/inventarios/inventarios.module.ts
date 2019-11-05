import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventariosPage } from './inventarios.page';
import { InventarioNovoPage } from './inventario-novo/inventario-novo.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: InventariosPage },
      { path: 'inventario-novo', component: InventarioNovoPage}
    ])
  ],
  declarations: [InventariosPage, InventarioNovoPage]
})
export class InventariosPageModule {}
