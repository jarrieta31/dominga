import { Component, OnDestroy } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Subscription } from "rxjs";
import { PlaceService } from "src/app/services/database/place.service";
import { Place } from "src/app/shared/place";

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
})
export class PlacePage implements OnDestroy {
  constructor(
    private browser: InAppBrowser,
    private placeSvc: PlaceService
  ) {}

  ngOnDestroy(){
    this.sourcePlace.unsubscribe();
  }

  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  places: Place[] = [];

  sourcePlace: Subscription;

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  ionViewWillEnter() {
    this.placeSvc.getPlaces();
    this.sourcePlace = this.placeSvc.places.subscribe((res) => (this.places = res));
  }
}
