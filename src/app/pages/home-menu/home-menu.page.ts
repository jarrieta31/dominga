import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DatabaseService } from "src/app/services/database.service";

@Component({
  selector: "app-home-menu",
  templateUrl: "./home-menu.page.html",
  styleUrls: ["./home-menu.page.scss"],
})
export class HomeMenuPage implements OnInit, OnDestroy {
  filterDepto: boolean = false;
  filterDistance: boolean = false;

  filterInitail: FormGroup;
  default: string = "San José";
  selected: any = '';

  constructor(private dbService: DatabaseService) {
    this.filterInitail = new FormGroup({
      depto: new FormControl(null),
    });
    // setValue es para agregarle un valor
    this.filterInitail.controls["depto"].setValue(this.default, {
      onlySelf: true,
    });
    // para obtenerlo necesitarias un get por ejemplo
    this.selected = this.filterInitail.get("depto");
    
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  seeDepto() {
    this.filterDepto = !this.filterDepto;
    this.filterDistance = false;

    if (this.filterDistance == false) {
      this.filterDepto = true;
    }
  }

  seeDistance() {
    this.filterDistance = !this.filterDistance;
    this.filterDepto = false;

    if (this.filterDepto == false) {
      this.filterDistance = true;
    }
  }
}
