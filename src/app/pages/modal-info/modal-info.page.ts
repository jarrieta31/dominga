import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits';

import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

	items : CircuitsModel[] = [];

  constructor(
  	private database: DatabaseService,
  	private activatedRoute: ActivatedRoute,
  	private router: Router
  	) { }

  ngOnInit() {
  	this.getLugaresId();
  }

  async getLugaresId(){
  this.activatedRoute.paramMap.subscribe(params => {
      //console.log(params.get("id"));
         this.database.getPlacesId(params.get("id")).subscribe((resultado: any) => {
         this.items = [];

        
        this.items = resultado;
        console.log(this.items);
      }); 
   });
  }

}
