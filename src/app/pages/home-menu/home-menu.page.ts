import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Departament } from "src/app/shared/departament";

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
    private geolocationSvc: GeolocationService) {}

  seeDepto() {
    this.depto = !this.depto;
  }

  select(depto: string | null, distance: number | null) {
    this.dbService.getSelectMenu(depto, distance);
    this.deptoSelected = depto;
  }

  ionViewWillEnter() {
    this.deptoSelected = this.dbService.selectionDepto;
    this.depto = false;
    this.dbService.getDepartamentosActivos();
    this.deptos = this.dbService.departamentosActivos.subscribe( res => this.deptosActivos = res);
  }

  ionViewDidLeave() {
    this.deptos.unsubscribe();
  }
}
