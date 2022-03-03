import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeasuresService {

  screenWidth: number = 0;
  screenHeightSlider: number = 0;
  screenHeightSliderPX: string = null;

  constructor() { 
    this.screenWidth = screen.width;
    this.screenHeightSlider = this.screenWidth/1.7;
    this.screenHeightSliderPX = this.screenHeightSlider.toString() + 'px';
  }
}
