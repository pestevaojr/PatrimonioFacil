import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Toast } from '@ionic-native/toast/ngx';
import { SairService } from './services/sair.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private toast: Toast,
    private sairService: SairService

  ) {
    this.initializeApp();

    this.backButtonEvent();
  }

  initializeApp() {
    console.log('Iniciando aplicação');
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      } else {
        this.statusBar.styleDefault();
      }
      console.log('Aplicação iniciada');
    });
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      if (this.sairService.podeSair) {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // this.platform.exitApp(); // Exit from app
          navigator['app'].exitApp(); // work in ionic 4

        } else {
          this.toast.show(
            `Pressione voltar novamente para sair do app.`,
            '2000',
            'center')
            .subscribe();
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }
}
