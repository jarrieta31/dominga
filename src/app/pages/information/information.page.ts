import { Component } from '@angular/core';
import { InformationService } from 'src/app/services/database/information.service';
import { InfoSlider } from '../../shared/info-slider';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage {
  
	information: any[];

  imagesSliderInfo: InfoSlider[];

	automaticClose = false;


  slideOpts = {
        initialSlide: 0,
        speed: 2000,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay:true,
    };

  constructor(
    public infoSvc: InformationService
  ) { 
  
  }
}
