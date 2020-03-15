import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Place } from 'src/app/shared/place';
//import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

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
  

  constructor( public authenticationService: AuthService) {
    
  }

  ngOnInit() { 
    
  }

  onResetForm() {
    this.loginForm.reset;
  }

  onSubmit() {
    if(this.loginForm.valid){
      //let datos: Array<any> = Object.values(this.loginForm.value);
      this.email = this.loginForm.get('email').value;
      this.password = this.loginForm.get('password').value;
      this.authenticationService.signup(this.email, this.password);
      this.onResetForm();
      
      console.log("Login corrento:", this.loginForm.value.email);
    }else{
      console.log("No valido");
    }
  }
  
  
  

}
