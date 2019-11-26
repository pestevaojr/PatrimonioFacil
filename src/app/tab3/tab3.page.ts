import { Component } from '@angular/core';
import { /*ToastController,*/ Platform } from '@ionic/angular';
import { InventariosService } from '../inventarios/inventarios.service';
import { Inventario } from '../inventarios/inventario';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  codigoBemManual: number;

  constructor() { }

}
