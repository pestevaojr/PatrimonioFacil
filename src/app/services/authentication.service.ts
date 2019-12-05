import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleUser } from '../login/google-user';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userEmail: string;
  googleUser: GoogleUser = {};
  user: any;

  constructor(
    private googlePlus: GooglePlus,
    private fireAuth: AngularFireAuth,
    private navCtrl: NavController) {
    this.fireAuth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Usuário logado: ', user);
        this.navCtrl.navigateRoot('/tabs/inventarios');
      } else {
        console.log('Não logado');
        this.navCtrl.navigateRoot('/login');
      }
      this.user = user;
    });

  }

  registerUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  loginEmailPassword(email, password) {
    /*firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
.then(function() {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even
  // if a user forgets to sign out.
  // ...
  // New sign-in will be persisted with session persistence.
  return firebase.auth().signInWithEmailAndPassword(email, password);
})
.catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});*/

    return this.fireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
      () => new Promise<any>((resolve, reject) => {
        this.fireAuth.auth.signInWithEmailAndPassword(email, password)
          .then(
            res => {
              this.userEmail = email;
              resolve(res);
              console.log(res);
            },
            err => {
              this.userEmail = '';
              reject(err);
              console.log(err);
            });
      }));
  }

  logoutEmailPassword() {
    return new Promise((resolve, reject) => {
      if (this.fireAuth.auth.currentUser) {
        this.fireAuth.auth.signOut()
          .then(() => {
            console.log('Log Out');
            this.userEmail = '';
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
    //return this.fireAuth.auth.currentUser;
    return this.user;
  }
}
