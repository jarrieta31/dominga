import { Component } from "@angular/core";

import { DondeComer } from "../../shared/donde-comer";

import { DatabaseService } from "../../services/database.service";
import { WhereEatService } from "src/app/services/database/where-eat.service";
import { LoadingController } from "@ionic/angular";
import { InfoSlider } from "../../shared/info-slider";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-where-eat",
  templateUrl: "./where-eat.page.html",
  styleUrls: ["./where-eat.page.scss"],
})
export class WhereEatPage {
  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
  });

  sliderDondeComer: InfoSlider[];

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
  /**subscription activa con los lugares del servicio*/
  sourceEat: Subscription;
  /**guarda las localidades con lugares publicados */
  location: any[] = [];
  /**controla cuando descartar el spinner de carga */
  isLoading = false;

  isFilter = false;
  /** =====<=<=<=< Variables Filtro localidad <============== */

  slider = this.database
    .getSliderDondeComer()
    .snapshotChanges()
    .subscribe((data) => {
      this.sliderDondeComer = [];
      data.forEach((item) => {
        let a = item.payload.toJSON();
        a["$key"] = item.key;
        this.sliderDondeComer.push(a as InfoSlider);
      });
    });

  constructor(
    private database: DatabaseService,
    private afs: WhereEatService,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) {}

  ngOnDestroy() {
    this.slider.unsubscribe();
  }

  async show(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: "bubbles",
    });

    this.loading.present().then(() => {
      this.slider;
      this.loading.dismiss();
    });
  }

  /** =====>=>=>=> Metodos Filtro localidad <============== */

  changeFilter() {
    this.isFilter = !this.isFilter;
  }

  filterEat() {
    this.dataForm = this.filterForm.value;
  }

  ionViewWillEnter() {
    this.afs.getDondeComer();
    this.sourceEat = this.afs.donde_comer.subscribe((res) => {
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
    this.sourceEat.unsubscribe();
  }
}
