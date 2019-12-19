import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { SairService } from '../services/sair.service';

@Component({
  selector: 'app-sobre',
  templateUrl: 'sobre.page.html',
  styleUrls: ['sobre.page.scss']
})
export class SobrePage {

  constructor(
    private platform: Platform,
    private toast: Toast,
    private sairService: SairService) { }

  ionViewDidEnter() {
    this.sairService.podeSair = true;
  }

  ionViewWillLeave() {
    this.sairService.podeSair = false;
  }

}
