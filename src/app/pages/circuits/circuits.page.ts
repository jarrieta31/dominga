import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-circuits',
  templateUrl: './circuits.page.html',
  styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit {

  tipoCircuito = [];

  constructor(public database: DatabaseService) { }

  ngOnInit() {
  	this.getTipoCircuito();
  }

  getTipoCircuito() {
    
      this.database.getTypeCircuits().subscribe((resultado: any) => {
            this.tipoCircuito = [];
            this.tipoCircuito = resultado;
      });
    
  }

}
