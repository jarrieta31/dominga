import { Component } from "@angular/core";
import { DondeDormir } from "../../shared/donde-dormir";
import { LoadingController } from "@ionic/angular";
import { WhereSleepService } from "src/app/services/database/where-sleep.service";
import { Subject, Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-where-sleep",
  templateUrl: "./where-sleep.page.html",
  styleUrls: ["./where-sleep.page.scss"],
})
export class WhereSleepPage {
  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  sleep: DondeDormir[] = [];
  loading: any;
  textoBuscar = "";
 
  locationActive: any[] = [];

  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**se guardan los sliders de la pantalla donde_comer */
  sliderSleep: Slider[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private sleepSvc: WhereSleepService,
    private fb: FormBuilder,
    private sliderSvc: SlidesService
  ) {}

  async show(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: "bubbles",
    });

    this.loading.present().then(() => {
      this.loading.dismiss();
    });
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  filterSleep() {
    this.dataForm = this.filterForm.value;
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    this.isOpenLocation = !this.isOpenLocation;
  }

  changeLocation() {
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isOpenLocation == false) this.isFilterLocation = false;
  }
  ionViewWillEnter() {
    this.unsubscribe$ = new Subject<void>();

    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "donde_comer") this.sliderSleep.push(item);
        });
      });
    this.sleepSvc.getDondeDormir();
    this.sleepSvc.donde_dormir
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.sleep = res;

        this.locationActive = [];

        this.sleep.forEach((loc) => {
          let isLocation: boolean = false;

          if (this.locationActive.length == 0) {
            this.locationActive.push({ localidad: loc.localidad });
            isLocation = true;
          } else {
            this.locationActive.forEach((locExist) => {
              if (loc.localidad == locExist.localidad) isLocation = true;
            });
          }
          if (!isLocation)
            this.locationActive.push({ localidad: loc.localidad });
        });
      });
    this.show("Cargando lugares...");
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
