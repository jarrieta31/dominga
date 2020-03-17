import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
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
    private alertCtrl: AlertController) {    
  }

  ngOnInit() {}

  onResetForm() {
    this.loginForm.reset;
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.email = this.loginForm.get('email').value;
      this.password = this.loginForm.get('password').value;
      this.authenticate(this.email, this.password);
      this.onResetForm();
      
      console.log("Form Login corrento:", this.loginForm.value.email);
    }else{
      console.log("No valido");
    }
  }
  
  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;        
        authObs = this.authService.login(email, password);        
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'No se pudo ingresar, intente nuevamente.';
            if (code === 'EMAIL_NOT_FOUND') {
              message = 'No se pudo encontrar la dirección de correo electrónico.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'La contraseña no es correcta';
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Autencitación fallida',
        message: message,
        buttons: ['Cerrar']
      })
      .then(alertEl => alertEl.present());
  }

  resetPassword(){
    
  }
  

}
