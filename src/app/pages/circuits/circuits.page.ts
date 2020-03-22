import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits';


@Component({
  selector: 'app-circuits',
  templateUrl: './circuits.page.html',
  styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit {

  constructor(public database: DatabaseService) { }

  ngOnInit() {
  	this.addCircuit();
  }

  addCircuit() {
    
      var circuito: CircuitsModel = new CircuitsModel();
      
      circuito.nombre = "nombre";
      circuito.descripcion = "descripcion";
      circuito.arrayLugares[].idLugar = "1";

      console.log(circuito);

      this.database.addCircuits(circuito).subscribe(resultado => {
        console.log(resultado);
      });
    
  }

}
