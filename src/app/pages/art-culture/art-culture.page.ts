import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-art-culture',
  templateUrl: './art-culture.page.html',
  styleUrls: ['./art-culture.page.scss'],
})
export class ArtCulturePage implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}
