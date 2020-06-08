import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../shared/user.class';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  
  user: User = new User();
  //email: string;
  //password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  isLoading = false;
  isLogin = true;

  constructor( 
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private keyboard: Keyboard) {    
  }

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
    
  ngOnInit() {
  }

  onResetForm() {
    this.registerForm.reset;
  }

  handleRegister(){
    this.keyboard.hide();
  }

  onSubmit() {
    if(this.registerForm.valid){
      let email = this.registerForm.get('email').value;
      let password = this.registerForm.get('password').value;
      email = email.trim();
      password = password.trim();
      this.onRegister(email, password);
      this.onResetForm();
      
      //console.log("Registro enviado");
    }else{
      //let mensaje = "Formulario registro no válido";
      //this.showAlert(mensaje);
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

  async onRegister(email: string, password:string ){
    try {
      this.presentRegisterLoading();
      const user = await this.authService.signUpWithEmail(email, password);
      if(user){
        this.presentRegisterLoading();
        this.router.navigateByUrl('/home')
      }      
    } catch (error) {
      console.error(error.code)
      var mensaje;
      switch (error.code) {
        case "auth/network-request-failed":
          mensaje = "No se pudo establecer la conxión a internet.";
          break;
        case "auth/email-already-in-use":
          mensaje = `El correo ${email} ya está es uso.`;
          break;
        default:
          mensaje = "El registro no se realizo !!!.";
          break;
      }
       
      this.showAlert(mensaje);
    }
  }

  ngOnDestroy(){
  }

  async presentRegisterLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Enviando registro ...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

}
