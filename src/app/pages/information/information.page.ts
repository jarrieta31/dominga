import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit, OnDestroy {
  
  ngOnDestroy() {
  }

	information: any[];

	automaticClose = false;

  textoBuscar = '';

  constructor(private http: HttpClient) { 
  	this.http.get('../../../assets/information.json').subscribe(res => {
  		this.information = res['items'];
  	});

    //this.information[0].open = true;
  }

  ngOnInit() {
  }

  toggleSection(index){
  	this.information[index].open = !this.information[index].open;

  	if(this.automaticClose && !this.information[index].open){
  		this.information
  		.filter((item, itemIndex) => itemIndex != index)
  		.map(item => item.open = false);
  	}
  }

  toggleItem(index, childIndex){
    this.information[index].children[childIndex].open = !this.information[index].children[childIndex].open;
  }

  buscar( event ){
    this.textoBuscar = event.detail.value; 
  }
}
