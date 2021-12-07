import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { TwoPoints } from 'src/app/shared/two-points';
import { Subscription } from "rxjs";
import { Place } from 'src/app/shared/place';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.page.html',
  styleUrls: ['./home-menu.page.scss'],
})
export class HomeMenuPage implements OnInit, OnDestroy {

  lugares: Place[] = [];
  lugaresSuscription: Subscription;

  constructor(
    private geoSvc: GeolocationService, private dbSvc: DatabaseService
  ) { }

  ngOnInit() {
    this.lugaresSuscription = this.dbSvc.getObservablePlace().subscribe( lugar => {this.lugares = lugar; 
      this.lugares.forEach( res => {
        let maxmin: TwoPoints = {longitud1: res.ubicacion.lng, latitud1: res.ubicacion.lat, longitud2: -56.7061826207969, latitud2:-34.33806617025381 }
          console.log(this.geoSvc.calculateDistance(maxmin));
          console.log(this.lugares);
      })} );
  }

  ngOnDestroy() {
    this.lugaresSuscription.unsubscribe();
  }


}
