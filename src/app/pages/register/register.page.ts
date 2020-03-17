import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string;
  password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  isLoading = false;
  isLogin = true;

  // Creo el formulario de registro
  registerForm: FormGroup = new FormGroup ({
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
  
  ngOnInit() {
  }

  onResetForm() {
    this.registerForm.reset;
  }

  onSubmit() {
    if(this.registerForm.valid){
      this.email = this.registerForm.get('email').value;
      this.password = this.registerForm.get('password').value;
      this.register(this.email, this.password);
      this.onResetForm();
      
      console.log("Registro enviado");
    }else{
      console.log("Formulario registro no valido");
    }
  }

  register(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;        
        authObs = this.authService.signup(email, password);
        
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
            let message = 'No se pudo registrar, intente nuevamente.';
            if (code === 'EMAIL_EXISTS') {
              message = '¡La dirección de correo electrónico ya existe!';
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Registro fallido',
        message: message,
        buttons: ['Cerrar']
      })
      .then(alertEl => alertEl.present());
  }

}
