import { Component } from "@angular/core";
import { DondeComer } from "../../shared/donde-comer";
import { WhereEatService } from "src/app/services/database/where-eat.service";
import { LoadingController } from "@ionic/angular";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";

@Component({
  selector: "app-where-eat",
  templateUrl: "./where-eat.page.html",
  styleUrls: ["./where-eat.page.scss"],
})
export class WhereEatPage {
  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
  });

  loading: any;

  locationActive: any[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /** =====>=>=>=> Variables Filtro localidad <============== */
  /**guarda los lugares activos en la subscription del servicio */
  eat: DondeComer[] = [];
  /**guarda las localidades con lugares publicados */
  location: any[] = [];
  /**controla cuando descartar el spinner de carga */
  isLoading = false;

  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  /** =====<=<=<=< Variables Filtro localidad <============== */

  /**se guardan los sliders de la pantalla donde_comer */
  sliderEat: Slider[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private afs: WhereEatService,
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

  /** =====>=>=>=> Metodos Filtro localidad <============== */
  /** Devuelve una lista de localidades */
  get localidades() {
    const weat = this.eat;
    let localidades: string[] = [];
    if (weat.length > 0) {
      weat.forEach((we) => {
        if (localidades.indexOf(we.localidad) == -1) {
          localidades.push(we.localidad);
        }
      });
    }
    return localidades;
  }

  filterEat() {
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

    this.afs.getDondeComer();
    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "donde_comer") this.sliderEat.push(item);
        });
      });

    this.afs.donde_comer.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.eat = res;
      this.locationActive = [];
      this.eat.forEach((loc) => {
        let isLocation = false;
        if (this.locationActive.length == 0) {
          this.locationActive.push({ localidad: loc.localidad });
          isLocation = true;
        } else {
          this.locationActive.forEach((locExist) => {
            if (loc.localidad == locExist.localidad) isLocation = true;
          });
        }
        if (!isLocation) this.locationActive.push({ localidad: loc.localidad });
      });
    });
    this.show("Cargando lugares...");
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
