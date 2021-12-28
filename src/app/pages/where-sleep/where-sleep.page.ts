import { Component } from "@angular/core";
import { DondeDormir } from "../../shared/donde-dormir";
import { LoadingController } from "@ionic/angular";
import { WhereSleepService } from "src/app/services/database/where-sleep.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-where-sleep",
  templateUrl: "./where-sleep.page.html",
  styleUrls: ["./where-sleep.page.scss"],
})
export class WhereSleepPage {
  sleep: DondeDormir[];
  loading: any;
  textoBuscar = "";
  wsleep_suscribe: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private sleepSvc: WhereSleepService
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

  ionViewWillEnter() {
    this.show("Cargando lugares...");
    this.sleepSvc.getDondeDormir();
    this.wsleep_suscribe = this.sleepSvc.donde_dormir.subscribe(
      (res) => (this.sleep = res)
    );
  }

  ionViewDidLeave() {
    this.wsleep_suscribe.unsubscribe();
  }
}
