import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

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
    if (this.authService.userEmail) {
      console.log('UserEmail', this.authService.userEmail);
      return this.authService.userEmail;
    } else if (this.authService.googleUser.email) {
      console.log('Google');
      return this.authService.googleUser.email;
    } else if (this.authService.userDetails()) {
      console.log('User Details', this.authService.userDetails());
      return this.authService.userDetails().email;
    }

    return '';
  }
}
