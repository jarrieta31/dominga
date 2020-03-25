import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits'

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

	private Arraycircuits: Array<CircuitsModel> = new Array();
	private sinCircuitos = true;

  	constructor(public database: DatabaseService) { }

  	ngOnInit() {
  		this.getCircuitos();
  		//console.log("Soy resultados");
  		//console.log(this.Arraycircuits);

  }

  public getCircuitos(){
  	this.database.getCircuits().subscribe((resultado: Array<CircuitsModel>) => {
				// Se limpian los circuitos que ya teniamos
				 this.Arraycircuits = [];
				// this.sinCircuitos = false;
				//console.log(resultado);
				// resultado.forEach(element => console.log(element));
				
				// Se setea en el atributo que se mostrara en el HTML
				// resultado.forEach((circuito: CircuitsModel) => {
				// 	circuito.descripcion = circuito.descripcion.substr(0, 4) + " ...";
				// });
				//this.Arraycircuits.push(resultado);
				this.Arraycircuits = resultado;
				
		});
  }
}


