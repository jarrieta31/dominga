import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { Place } from '../../shared/place';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';
import distance from '@turf/distance';


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    items: Place[];
    items$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
    posicion$: Observable<Point>;
    casaDominga =  {"longitud": "-56.7145", "latitud": "-34.340007"};
    
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
        private router: Router,
        private geolocationService:GeolocationService
    ) {}

    su = this.database.getPlaces().snapshotChanges().subscribe(data => { 
      this.items = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.items.push(a as Place);
      })

      this.items.forEach(place =>{       
        let options = { units: 'kilometers' }; 
        let dist = distance([place.longitud, place.latitud], [this.casaDominga.longitud ,this.casaDominga.latitud], options);
        let distFormat = parseFloat(dist).toFixed(3);
        place.distancia = "Desde C. Dominga "+ distFormat + " Km";
      })
    });

    ngOnInit() {
        this.su; 
        this.posicion$ = this.geolocationService.getPosicionActual$()  
    }

    cerrarSesion() {
        this.su.unsubscribe();
        this.authService.signOut();
    }
}