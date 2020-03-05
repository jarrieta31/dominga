import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Place } from 'src/app/shared/place';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  lugar: Place = {$key: "", 
    name: "Casa Dominga", 
    description: "Espacio de cowork",
    position: ["892", "178"],
    image: "/assets/miimagen",
    audio: "/assets/miaudio",
    video: "/assets/mivideo"
  };

  constructor( public authenticationService: AuthService, public fireServ: FirebaseService) {
    
  }

  ngOnInit() { 
    //this.addPlace(); //Agrega un nuevo logar
    console.log("Mostrar lugar: ", this.fireServ.getPlaceList());
  }

  signUp() {
    this.authenticationService.SignUp(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  signIn() {
    this.email = ''; 
    this.password = '';
  }

  signOut() {
    this.authenticationService.SignOut();
  }

  onSubmit(){
    
  }

  addPlace(){
    
    this.fireServ.createPlace(this.lugar);
  }

  
  

}
