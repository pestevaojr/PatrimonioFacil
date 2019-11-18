import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

// import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isCordova: boolean;
  validationsForm: FormGroup;
  errorMessage = '';
  validationMessages = {
    email: [
      { type: 'required', message: 'Email é obrigatório.' },
      { type: 'pattern', message: 'Por favor, insira um email válido.' }
    ],
    password: [
      { type: 'required', message: 'Senha é obrigatória.' },
      { type: 'minlength', message: 'Senha deve ter ao menos 5 caracteres.' }
    ]
  };

  constructor(

    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private googlePlus: GooglePlus,
    // private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private toastNative: Toast,
    private platform: Platform,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.isCordova = this.platform.is('cordova');

    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  loginEmailPassword(value) {
    this.authService.loginEmailPassword(value.email, value.password)
      .then(res => {
        console.log(res);
        this.errorMessage = '';
        this.navCtrl.navigateForward('tabs/inventarios');
      }, err => {
        this.errorMessage = err.message;
      });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...'
    });
    this.presentLoading(loading);

    this.authService.loginWithGoogle().then(
      user => {
        loading.dismiss();
        this.navCtrl.navigateForward('tabs/inventarios');
        this.presentToast('Login efetuado com sucesso');
      },
      err => {
        console.log(err);
        loading.dismiss();
        this.presentToast('Erro ao efetuar login. ' + err);
      });
  }

  async presentAlert(mensagem: string) {
    const alert = await this.alertCtrl.create({
      message: mensagem,
      buttons: ['OK']/*,
      subHeader: '',
      buttons: ['Dismiss']*/
    });
    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async presentToast(mensagem: string) {
    if (this.isCordova) {
      this.toastNative.show(mensagem, '2000', 'center').subscribe();
    } else {
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000
      });
      toast.present();
    }
  }
}
