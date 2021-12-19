import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatabaseService } from "src/app/services/database.service";

@Component({
  selector: "app-home-menu",
  templateUrl: "./home-menu.page.html",
  styleUrls: ["./home-menu.page.scss"],
})
export class HomeMenuPage implements OnInit, OnDestroy {

  depto: boolean = false

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  seeDepto() {
    this.depto = true;

    // if(this.depto) {
    //   this.depto = false;
    // }
  }

  close() {
    this.depto = false;

    // if(this.depto) {
    //   this.depto = false;
    // }
  }

  select(depto: string | null, distance: number |null) {
    this.dbService.getSelectMenu(depto, distance);
  }

  // loadData() {
  //   this.dbService.getDepto();
  // }
}
