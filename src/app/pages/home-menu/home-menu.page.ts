import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { Departament } from "src/app/shared/departament";

@Component({
  selector: "app-home-menu",
  templateUrl: "./home-menu.page.html",
  styleUrls: ["./home-menu.page.scss"],
})
export class HomeMenuPage implements OnInit {

  depto: boolean = false;
  deptosActivos: Departament[] = [];

  deptos: Subscription;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    
  }

  seeDepto() {
    this.depto = !this.depto;
  }

  select(depto: string | null, distance: number | null) {
    this.dbService.getSelectMenu(depto, distance);
  }

  ionViewWillEnter() {
    this.depto = false;
    this.dbService.getDepartamentosActivos();
    this.deptos = this.dbService.departamentosActivos.subscribe( res => this.deptosActivos = res);
  }

  ionViewDidLeave() {
    this.deptos.unsubscribe();
  }
}
