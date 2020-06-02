import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../shared/user.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  
  ngOnDestroy(){
  }

  user: User = new User();
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
      this.email = this.email.trim();
      this.password = this.password.trim();
      this.onRegister();
      this.onResetForm();
      
      //console.log("Registro enviado");
    }else{
      console.log("Formulario registro no valido");
    }
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

  async onRegister(){
    const user = await this.authService.signUpWithEmail(this.email, this.password);
    if(user){
      console.log('Se creó el usuario');
      this.router.navigateByUrl('/home')
    }
  }

}
