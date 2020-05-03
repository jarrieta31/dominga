import { Component, OnInit, OnDestroy } from '@angular/core';
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

    su = this.database.getPlaces().snapshotChanges().subscribe(data => { 
      this.items = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.items.push(a as Place);
      })
    });

    ngOnInit() {
        this.su;   
    }

    cerrarSesion() {
        this.su.unsubscribe();
        this.authService.signOut();
    }
}