import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/user.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  backButtonSubscription: any;
  email: string;
  password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  isLoading = false;

  // Creo el formulario con las validaciones
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      Validators.pattern(this.emailPattern)
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)
    ]))
  })

  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private alertController: AlertController,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    if(this.geolocationService.posicion$.value != null){
      this.geolocationService.pararSubscriptionMatch();
      this.geolocationService.pararSubscriptionClock();
    }
    
  }

  ngOnDestroy(): void {
    this.backButtonSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.platform.backButton.subscribe();
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      let url = this.router.url
      if(url === '/login' || url === '/home'){
        this.cerrarAppAlertConfirm()
      }     
    });
  }

  onResetForm() {
    this.loginForm.reset;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.email = this.loginForm.get('email').value;
      this.password = this.loginForm.get('password').value;
      this.onLogin();
      this.loginForm.reset;
      console.log("Form Login corrento:", this.loginForm.value.email);
    } else {
      console.log("Formulario no valido");
    }
  }

  //Funcion que llama al método onLogin del servicio
  async onLogin() {
    const user = await this.authService.signInWithEmail(this.email, this.password);
    if (user) {
      this.router.navigateByUrl('/home');
    }
  }

  private showAlert(message: string, title: string) {
    this.alertCtrl
      .create({
        header: title,
        message: message,
        buttons: ['Cerrar']
      })
      .then(alertEl => alertEl.present());
  }

  async resetPasswordAlertPrompt() {
    if (this.loginForm.get('email').value != "") {
      this.email = this.loginForm.get('email').value;
    }
    const input = await this.alertCtrl.create({
      header: 'Restablecer Contraseña',
      subHeader: 'Ingrese su email',
      inputs: [
        {
          name: 'txtEmail',
          type: 'email',
          placeholder: 'Ingrese su email',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {
            console.log('Boton cancelar reset contraseña');
          }
        }, {
          text: 'Cambiar Contraseña',
          handler: (data) => {
            console.log('Boton confirmar reset contraseña', data);
            this.email = data.txtEmail;
            this.loadingResetPassword();
          }
        }
      ]
    });
    await input.present();
  }

  loadingResetPassword() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Enviando solicitud...' })
      .then(loadingEl => {
        loadingEl.present();
        let resetPassObs = of(this.authService.resetPassword(this.email));
        resetPassObs.subscribe(
          resData => {
            console.log(resData);
            loadingEl.dismiss();
            //this.router.navigateByUrl('/home');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = '¡No se pudo enviar el reset!';
            if (code === 'EMAIL_NOT_FOUND') {
              message = 'No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado.';
            } else if (code === 'auth/user-not-found') {
              message = 'mensaje user not found'
            }
            let title = 'Reset de contraseña fallida';
            this.showAlert(message, title);
          }
        );
      });
  }

  // async savePassword(email:string, password:string){
  //   const alertSavePassword = await this.alertCtrl.create({
  //     header: 'Alerta de seguridad',
  //     subHeader: '¿Deséa guardar su contraseña?',
  //     message:  '<strong>Talvez desee guardar sus datos para ingresar</strong>',
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //         cssClass: 'primary',
  //         handler: () => {
  //           console.log('No guardo sus datos contraseña');
  //         }
  //       }, {
  //         text: 'Si',
  //         handler: (data) => {
  //           console.log('Guardando su contraseña', data);
  //           this.authService.storeAuthData(email,password);
  //         }
  //       }
  //     ]
  //   });
  //   await alertSavePassword.present();
  // }

  loginGoogle() {
    this.authService.authWithGoogle();
  }


  // onLoginFacebook(): void {
  //   this.authService.loginFacebookUser()
  //     .then((res) => {
  //       this.onLoginRedirect();
  //     }).catch(err => console.log('err', err.message));
  // }

  //  onLoginRedirect(): void {
  //   this.router.navigate(['/home']);
  // }

  async cerrarAppAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Salir!',
      message: '<strong>¿Seguro que quiere salir?</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Cerrar',
          handler: () => {
            console.log('Confirm Okay');
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

}
