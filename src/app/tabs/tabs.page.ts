import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  private user;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService
  ) { }

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

  get userEmail() {
    if (!this.user) {
      if (this.authService.userDetails()) {
        this.user = this.authService.userDetails();
        console.log('User Details', this.authService.userDetails());
      } else {
        return '';
      }
    }
    return this.user.email;
  }
}
