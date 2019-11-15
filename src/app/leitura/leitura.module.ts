import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeituraPage } from './leitura.page';
import { InventariosPageModule } from '../inventarios/inventarios.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LeituraPage }])
  ],
  declarations: [LeituraPage]
})
export class LeituraPageModule {}
