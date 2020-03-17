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

  // Creo el formulario
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
  
  constructor( public authService: AuthService) {
    
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
      this.authService.signup(this.email, this.password);
      this.onResetForm();
      
      console.log("Registro enviado");
    }else{
      console.log("Formulario registro no valido");
    }
  }

}
