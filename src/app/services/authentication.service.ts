import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleUser } from '../login/google-user';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  googleUser: GoogleUser = {};
  user: any;

  constructor(
    private googlePlus: GooglePlus,
    private fireAuth: AngularFireAuth,
    private navCtrl: NavController,
    private ngZone: NgZone,
    private alertCtrl: AlertController) {

    console.log('Instanciando AuthenticationService');
    this.fireAuth.auth.onAuthStateChanged(user => this.ngZone.run(() => {
      if (user) {
        console.log('Usuário logado: ', user);
        this.navCtrl.navigateForward('/tabs/inventarios');
      } else {
        console.log('Não logado');
        this.navCtrl.navigateForward('');
      }
      this.user = user;
      
    }));
  }

  async presentAlert(mensagem: string) {
    const alert = await this.alertCtrl.create({
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  registerUser(email, password) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginEmailPassword(email, password) {
    return this.fireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
      () => new Promise<any>((resolve, reject) => {
        console.log('Entrou no setPersistence');
        this.fireAuth.auth.signInWithEmailAndPassword(email, password)
          .then(
            res => {
              console.log('Usuário', res);
              resolve(res);
            },
            err => {
              console.log(err);
              reject(err);
            });
      }));
  }

  logoutEmailPassword() {
    return new Promise((resolve, reject) => {
      if (this.fireAuth.auth.currentUser) {
        this.fireAuth.auth.signOut()
          .then(() => {
            console.log('Log Out');
            this.user = undefined;
            this.googleUser = undefined;
            resolve();
          }).catch((error) => {
            reject(error);
          });
      }
    });
  }

  loginWithGoogle() {
    const params = {
      scopes: '',
      webClientId: '856652910182-mce6gqk18kf9dlo6075i9545psjnif68.apps.googleusercontent.com',
      offline: true
    };

    return new Promise((resolve, reject) => {
      this.googlePlus.login(params)
        .then(user => {
          this.googleUser = {
            name: user.displayName,
            email: user.email,
            picture: user.imageUrl
          };
          const { idToken, accessToken } = user;
          const credential = accessToken ?
            firebase.auth.GoogleAuthProvider.credential(idToken, accessToken) :
            firebase.auth.GoogleAuthProvider.credential(idToken);
          this.fireAuth.auth.signInWithCredential(credential).then(
            () => resolve(this.googleUser),
            err => reject(err)
          );
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  userDetails() {
    return this.user;
  }
}
