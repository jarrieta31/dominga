import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preload-details',
  templateUrl: './preload-details.component.html',
  styleUrls: ['./preload-details.component.scss'],
})
export class PreloadDetailsComponent{

  @Input("url") url: string;
  @Input("alt") alt: string;
  @Input("urlPreload") urlPreload: string;

  viewImage = false;

  constructor() {}

  mostrarImagen() {
    this.viewImage = true;
  }

}
