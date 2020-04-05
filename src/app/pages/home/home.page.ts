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
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
