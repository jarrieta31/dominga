import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { TipoCircuito } from '../../shared/tipo-circuito';  

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  // Colocamos en la variable Dato la interface Favoritos[] 
  Dato: TipoCircuito[]; 
 
  constructor(public database: DatabaseService) { }

  ngOnInit() {
  	this.dataState();
  }

  dataState() {     
    // Dentro de la variable s colocamos el método database y hacemos llamado al 
    // método listarDatos()que se encuentra en el servicio 'DataService'
    let s = this.database.listarDatos(); 
 
    // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
    // último pasamos los datos a JSON
    s.snapshotChanges().subscribe(data => { 
      this.Dato = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Dato.push(a as TipoCircuito);
      })
    })
  }

}
