import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Departament } from "src/app/shared/departament";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-home-menu",
  templateUrl: "./home-menu.page.html",
  styleUrls: ["./home-menu.page.scss"],
})
export class HomeMenuPage {
  depto: boolean = false;
  deptosActivos: Departament[] = [];
  deptoSelected: any = null;

  deptos: Subscription;

  constructor(
    private dbService: DatabaseService,
    private geolocationSvc: GeolocationService,
    public alertController: AlertController
  ) {
    this.geolocationSvc.iniciarSubscriptionClock();
    this.geolocationSvc.iniciarSubscriptionMatch();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "SELECCIONAR FILTRO",
      message: "Debe seleccionar un filtro para continuar",
      buttons: [
        {
          text: "Departamento",
          handler: () => {
            this.depto = true;
          },
        },
        { text: "Distancia" },
      ],
    });

    if (
      (this.deptoSelected == null ||
      this.deptoSelected == undefined) &&
      !this.depto
    )
      await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log("onDidDismiss resolved with role", role);
  }

  seeDepto() {
    this.depto = !this.depto;
  }

  select(depto: string | null, distance: number | null) {
    this.dbService.getSelectMenu(depto, distance);

    if (depto != null && depto != undefined) {
      this.deptoSelected = depto;
      localStorage.setItem("deptoActivo", depto);
    } else if (distance != null && distance != undefined) {
      localStorage.setItem("distanceActivo", distance.toString());
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.presentAlert();
    }, 2500);
    let deptoSave = localStorage.getItem("deptoActivo");
    let distanceSave = localStorage.getItem("distanceActivo");

    if (deptoSave != null && deptoSave != undefined) {
      this.dbService.selectionDepto = deptoSave;
    } else if (distanceSave != null && distanceSave != undefined) {
      this.dbService.selectionDepto = distanceSave;
    }

    this.deptoSelected = this.dbService.selectionDepto;
    this.depto = false;
    this.dbService.getDepartamentosActivos();
    this.deptos = this.dbService.departamentosActivos.subscribe(
      (res) => (this.deptosActivos = res)
    );
  }

  ionViewDidLeave() {
    this.deptos.unsubscribe();
  }
}
