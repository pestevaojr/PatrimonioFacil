import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleUser } from '../login/google-user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userEmail: string;
  googleUser: GoogleUser = {};

  constructor(
    private googlePlus: GooglePlus,
    private fireAuth: AngularFireAuth) { }

  registerUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  loginEmailPassword(email, password) {
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
    return this.fireAuth.auth.currentUser;
  }
}
