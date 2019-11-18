import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService
  ) {

  }

  ngOnInit() {
    if (this.authService.userEmail) {
      // this.userEmail = this.authService.userDetails().email;
      this.userEmail = this.authService.userEmail;
    } else if (this.authService.googleUser.email) {
      this.userEmail = this.authService.googleUser.email;
    } else {
      this.navCtrl.navigateBack('/login');
    }
  }

  logout() {
    this.authService.logoutEmailPassword()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      });
  }
}
