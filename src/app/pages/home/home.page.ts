import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { Place } from '../../shared/place';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    items: Place[];

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
        spaceBetween: 20,
        direction: 'vertical'
    };

    constructor(
        private database: DatabaseService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.dataState();
    }

    dataState() {     
    // Dentro de la variable s colocamos el método database y hacemos llamado al 
    // método listarDatos()que se encuentra en el servicio 'DataService'
    let s = this.database.getPlaces(); 
 
    // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
    // último pasamos los datos a JSON
    s.snapshotChanges().subscribe(data => { 
      this.items = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.items.push(a as Place);
      })
      //console.log(this.items);
    }),
    err => console.log(err);
   
  }

    cerrarSesion() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}