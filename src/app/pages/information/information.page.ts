import { Component } from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { InformationService } from "src/app/services/database/information.service";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { InfoSlider } from "../../shared/info-slider";

@Component({
  selector: "app-information",
  templateUrl: "./information.page.html",
  styleUrls: ["./information.page.scss"],
})
export class InformationPage {
  constructor(
    public infoSvc: InformationService,
    public sliderSvc: SlidesService
  ) {}

  information: any[];
  imagesSliderInfo: InfoSlider[];
  automaticClose = false;

  slideOpts = {
    initialSlide: 0,
    speed: 2000,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**se guardan los sliders de la pantalla donde_comer */
  sliderInfo: Slider[] = [];

  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  ionViewWillEnter() {
    this.sliderSvc.slider
      .pipe(
        map((slider) => slider.filter((s) => s.pantalla === "informacion")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.sliderInfo = res;
      });
  }
}
