import { Component } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Departament } from "src/app/shared/departament";
import { Point } from "src/app/shared/point";

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
    private geolocationSvc: GeolocationService
  ) {
    this.geolocationSvc.iniciarSubscriptionClock();
    this.geolocationSvc.iniciarSubscriptionMatch();
  }

  seeDepto() {
    this.depto = !this.depto;
  }

  select(depto: string | null, distance: number | null) {
    this.dbService.getSelectMenu(depto, distance);
    this.deptoSelected = depto;

    if(depto != null && depto != undefined) {
      localStorage.setItem("deptoActivo", depto)
    } else if (distance != null && distance != undefined) {
      localStorage.setItem("distanceActivo", distance.toString())
    }
  }

  ionViewWillEnter() {
    let deptoSave = localStorage.getItem("deptoActivo");
    let distanceSave = localStorage.getItem("distanceActivo");

    if(deptoSave != null && deptoSave != undefined) {
      this.dbService.selectionDepto = deptoSave;
    }
    else if(distanceSave != null && distanceSave != undefined) {
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
