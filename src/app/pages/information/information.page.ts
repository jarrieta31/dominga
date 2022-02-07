import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { InfoSlider } from '../../shared/info-slider';



@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit, OnDestroy {
  
  ngOnDestroy() {
    // this.su.unsubscribe();
  }

	information: any[];

  imagesSliderInfo: InfoSlider[];

	automaticClose = false;

  textoBuscar = '';

  slideOpts = {
        initialSlide: 0,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay:true,
    };

  // su = this.db.getSliderInfo().snapshotChanges().subscribe(data => {
  //   this.imagesSliderInfo = [];
  //   data.forEach(item => {
  //     let a = item.payload.toJSON();
  //           a['$key'] = item.key;
  //           this.imagesSliderInfo.push(a as InfoSlider);
  //   })
    
  // })

  constructor(private http: HttpClient, private db: DatabaseService) { 
  	this.http.get('../../../assets/information.json').subscribe(res => {
  		this.information = res['items'];
  	});

    //this.information[0].open = true;
  }

  ngOnInit() {
    // this.su;
  }

  /**
   * 
   * @param index 
   */
  toggleSection(index){
  	this.information[index].open = !this.information[index].open;

  	if(this.automaticClose && !this.information[index].open){
  		this.information
  		.filter((item, itemIndex) => itemIndex != index)
  		.map(item => item.open = false);
  	}
  }

  /**
   * 
   * @param index 
   * @param childIndex 
   */
  toggleItem(index, childIndex){
    this.information[index].children[childIndex].open = !this.information[index].children[childIndex].open;
  }

  /**
   * Filtro de búsqueda
   * @param event
   */
  buscar( event ){
    this.textoBuscar = event.detail.value; 
  }
}
