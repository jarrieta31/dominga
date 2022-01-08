import { Component } from "@angular/core";
import { DondeDormir } from "../../shared/donde-dormir";
import { LoadingController } from "@ionic/angular";
import { WhereSleepService } from "src/app/services/database/where-sleep.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-where-sleep",
  templateUrl: "./where-sleep.page.html",
  styleUrls: ["./where-sleep.page.scss"],
})
export class WhereSleepPage {
  sleep: DondeDormir[] = [];
  loading: any;
  textoBuscar = "";
  sleep_suscribe: Subscription;

  locationActive: any[] = [];

  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  isFilter: boolean = false;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  constructor(
    private loadingCtrl: LoadingController,
    private sleepSvc: WhereSleepService,
    private fb: FormBuilder
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

  changeFilter() {
    this.isFilter = !this.isFilter;
  }

  filterSleep() {
    this.dataForm = this.filterForm.value;
  }

  ionViewWillEnter() {
    this.show("Cargando lugares...");
    this.sleepSvc.getDondeDormir();
    this.sleep_suscribe = this.sleepSvc.donde_dormir.subscribe((res) => {
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
        if (!isLocation) this.locationActive.push({ localidad: loc.localidad });
      });
    });
  }

  ionViewDidLeave() {
    this.sleep_suscribe.unsubscribe();
  }
}
