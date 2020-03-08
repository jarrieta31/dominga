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

  data: any;
  datos = [];

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
    fireServ.getPlace('-M1cQY4zLjoLbSTAk7bB').subscribe( data => {
      this.data = data;
      console.log(data);
    });

    fireServ.getPlaceList().subscribe( data => {
      this.datos = data;
      console.log(this.datos);
    });
    
    //console.log(fireServ.getPlaceList());
  }

  ngOnInit() { 
    //this.addPlace(); //Agrega un nuevo logar
    //this.data = this.fireServ.getPlaceList('place');
    
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
