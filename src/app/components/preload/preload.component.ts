import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-preload",
  templateUrl: "./preload.component.html",
  styleUrls: ["./preload.component.scss"],
})
export class PreloadComponent implements AfterViewInit {
  @Input("url") url: string;
  @Input("alt") alt: string;
  @Input("urlPreload") urlPreload: string;

  viewImage = false;

  constructor() {}

  ngAfterViewInit(): void {}

  mostrarImagen() {
    //console.log("carga finalizada");
    this.viewImage = true;
    //console.log(this.viewImage);
  }
}
