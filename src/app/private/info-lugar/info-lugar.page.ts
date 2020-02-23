import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-lugar',
  templateUrl: './info-lugar.page.html',
  styleUrls: ['./info-lugar.page.scss'],
})
export class InfoLugarPage implements OnInit {

	slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor() { }

  ngOnInit() {
  }

}
