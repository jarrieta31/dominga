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
  	//this.addCircuit();
  }

  addCircuit() {
    
      var circuito: CircuitsModel = new CircuitsModel();
      console.log(circuito);
      circuito.nombre = "teatro";
      circuito.descripcion = "arte";

      console.log(circuito);

      this.database.addCircuits(circuito).subscribe(resultado => {
        console.log(resultado);
      });
    
  }

}
