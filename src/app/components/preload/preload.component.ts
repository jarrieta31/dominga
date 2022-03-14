import { Component, Input } from "@angular/core";

@Component({
  selector: "app-preload",
  templateUrl: "./preload.component.html",
  styleUrls: ["./preload.component.scss"],
})
export class PreloadComponent {
  @Input("url") url: string;
  @Input("alt") alt: string;
  @Input("urlPreload") urlPreload: string;

  viewImage = false;

  constructor() {}

  mostrarImagen() {
    this.viewImage = true;
  }
}
