import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits'


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  items : CircuitsModel[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 1
  };

  cards = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 1,
    spaceBetween: 1,
    direction: 'vertical'
  };


  constructor(

      private database: DatabaseService,
      private authService: AuthService,
      private router: Router
      ) {}


  ngOnInit() {
    this.getLugares();
  }

   async getLugares(){
    this.database.getPlaces().subscribe((resultado: any) => {
          this.items = [];
        //console.log(resultado);

        this.items = resultado;
    });
  }

  cerrarSesion() {
    this.authService.signOut();
    this.router.navigateByUrl('/login');
  }

}
