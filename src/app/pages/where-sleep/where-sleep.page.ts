import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-where-sleep',
  templateUrl: './where-sleep.page.html',
  styleUrls: ['./where-sleep.page.scss'],
})
export class WhereSleepPage implements OnInit {

	sleep = [];

  constructor(private database: DatabaseService) { }

  ngOnInit() {
  	this.getWhereSleep();
  }

  async getWhereSleep(){
  	this.database.getSleep().subscribe( (resultado: any) => {
  		this.sleep = [];
  		this.sleep = resultado;
  		console.log(this.sleep);

  	})
  }

}
