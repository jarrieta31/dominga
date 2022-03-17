import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preload-list',
  templateUrl: './preload-list.component.html',
  styleUrls: ['./preload-list.component.scss'],
})
export class PreloadListComponent {

  @Input("url") url: string;
  @Input("alt") alt: string;
  @Input("clase") clase: string;
  @Input("urlPreload") urlPreload: string;

  viewImage = false;

  constructor() {}

  mostrarImagen() {
    this.viewImage = true;
  }

}
