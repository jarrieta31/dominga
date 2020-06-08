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
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription: any;
  //email: string;
  //password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  isLoading = false;

  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private alertController: AlertController,
    private geolocationService: GeolocationService,
    private keyboard: Keyboard
  ) {

    // Creo el formulario con las validaciones
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(60),
        Validators.pattern(this.emailPattern)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]))
    })
    this.geolocationService.subscriptionUser.unsubscribe();
  }

  ngOnInit() {

    if (this.platform.is('android')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    if (this.geolocationService.posicion$.value != null) {
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
      if (this.router.url.indexOf('/home') == 0 || this.router.url.indexOf('/login') == 0) {
        this.cerrarAppAlertConfirm()
      }
    });
  }

  onResetForm() {
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let email = this.loginForm.get('email').value;
      let password = this.loginForm.get('password').value;
      this.onLogin(email, password);
      this.onResetForm();
      // console.log("Form Login corrento:", this.loginForm.value.email);
    } else {
      // console.log("Formulario no valido");
    }
  }

  //Funcion que llama al método onLogin del servicio
  async onLogin(email: string, password: string) {
    email = email.trim();
    password = password.trim();
    try {
      this.presentLoginLoading();
      const user = await this.authService.signInWithEmail(email, password);
      if (user) {
        this.router.navigateByUrl('/home');
      }
    } catch (error) {
      let title = "Mensaje inicio de sesión";
      let menssage = "Su inicio de sesión no tuvo éxito!!. Verifique los datos ingresados.";
      this.showAlert(menssage, title);
    }
  }

  private showAlert(message: string, title: string) {
    this.alertCtrl
      .create({
        cssClass: 'custom-alert',
        header: title,
        message: message,
        buttons: ['Cerrar']
      })
      .then(alertEl => alertEl.present());
  }

  async resetPasswordAlertPrompt() {
    if (this.loginForm.get('email').value != "") {
      var email = this.loginForm.get('email').value;
    }
    const input = await this.alertCtrl.create({
      header: 'Restablecer Contraseña',
      subHeader: 'Ingrese su email',
      inputs: [
        {
          name: 'txtEmail',
          type: 'email',
          placeholder: 'Ingrese su email',
          value: email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {
            //  console.log('Boton cancelar reset contraseña');
          }
        }, {
          text: 'Cambiar Contraseña',
          handler: (data) => {
            //  console.log('Boton confirmar reset contraseña', data);
            email = data.txtEmail;
            this.loadingResetPassword(email);
          }
        }
      ]
    });
    await input.present();
  }

  loadingResetPassword(email: string) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: 'Enviando solicitud...' })
      .then(loadingEl => {
        loadingEl.present();
        var message;
        var title;
        try {
          this.authService.resetPassword(email).then(res =>{
            message = '¡Revise su correo';
            title = `Se ha enviado una nueva contraseña a ${email}`;
            loadingEl.dismiss();
            this.showAlert(message, title);

          }).catch(error => {
            console.log(error.code);            
            title = 'Restauración de contraseña fallida';
            loadingEl.dismiss();

            switch (error.code) {
              case "auth/user-not-found":
                message = `El correo ${email} no existe en nuestros registros!!`;
                break;            
              default:
                message = '¡La restauración de contraseña fallado.';
                break;
            }
            this.showAlert(message, title);
          })
          
        } catch (error) {
          //console.log(error.code);
          let message = '¡No se pudo enviar el reset!';
          let title = 'Restauración de contraseña ha fallado. Verifique sus datos y la conexión a internet';
          loadingEl.dismiss();
          this.showAlert(message, title);
        }
              
      });
  }

  loginGoogle() {
    this.authService.authWithGoogle();
  }

  handleLogin() {
    this.keyboard.hide();
  }

  async cerrarAppAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Salir!',
      message: '<strong>¿Seguro que quiere salir?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Cerrar',
          handler: () => {
            //  console.log('Confirm Okay');
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoginLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Enviando ...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
