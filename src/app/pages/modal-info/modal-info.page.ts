import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  nombre: string;
  descripcion: string;

  constructor(
  	private database: DatabaseService,
  	private activatedRoute: ActivatedRoute,
  	private router: Router
  	) { }

  ngOnInit() {
  	this.getInfoLugar();
  }

  async getInfoLugar() {
        this.activatedRoute.paramMap.subscribe(params => {
            // Dentro de la variable s colocamos el método database y hacemos llamado al 
            // método getPlaces() que se encuentra en el servicio 'DataService'

            let par = params.get("id");
                     
            let s = this.database.getPlaces();
            // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
            // último pasamos los datos a JSON
            s.snapshotChanges().subscribe(data => {
                    
                    data.forEach(item => {
                        if (par == item.key) {
                            let a = item.payload.toJSON();
                            a['$key'] = item.key; 
                            this.nombre = a['nombre'];
                            this.descripcion = a['descripcion'];                     
                        }
                    })
                }),
                err => console.log(err)
        });
    }

}
