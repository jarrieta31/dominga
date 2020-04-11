import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/user.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

import { switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User = new User();
  email: string;
  password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  isLoading = false;
  //isLogin = true;

  // Creo el formulario con las validaciones
  loginForm: FormGroup = new FormGroup ({
      email: new FormControl('',Validators.compose([ 
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern(this.emailPattern)
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]))
  })
  
  constructor( 
    public authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {}

  ngOnInit() {
    // this.authService.userIsAuthenticated.pipe(
    //   take(1),
    //   switchMap(isAuthenticated => {
    //     if(!isAuthenticated){
    //       return this.authService.autoLogin()
    //     }
    //   })
    // )
  }

  onResetForm() {
    this.loginForm.reset;
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.email = this.loginForm.get('email').value;
      this.password = this.loginForm.get('password').value;
      this.onLogin();
      this.loginForm.reset;      
      console.log("Form Login corrento:", this.loginForm.value.email);
    }else{
      console.log("Formulario no valido");
    }
  }

  //Funcion que llama al método onLogin del servicio
  async onLogin(){
    const user = await this.authService.signInWithEmail(this.email, this.password);
    if(user){
      console.log('Login correcto!!');
      this.savePassword(this.email, this.password);
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

  resetPassword(email: string) {
    this.resetPasswordAlertPrompt();    
  }

  async resetPasswordAlertPrompt() {

    if(this.loginForm.get('email').value != ""){
      this.email= this.loginForm.get('email').value;
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
            }else if( code === 'auth/user-not-found'){
              message = 'mensaje user not found'
            }
            let title = 'Reset de contraseña fallida';
            this.showAlert(message, title);
          }
        );
      });
  }

  async savePassword(email:string, password:string){
    const alertSavePassword = await this.alertCtrl.create({
      header: 'Alerta de seguridad',
      subHeader: '¿Deséa guardar su contraseña?',
      message:  '<strong>Talvez desee guardar sus datos para ingresar</strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {
            console.log('No guardo sus datos contraseña');
          }
        }, {
          text: 'Si',
          handler: (data) => {
            console.log('Guardando su contraseña', data);
            this.authService.storeAuthData(email,password);
          }
        }
      ]
    });
    await alertSavePassword.present();
  }

  loginGoogle(){
    this.authService.authWithGoogle();
  }

}
