import { Component, OnInit } from '@angular/core';

import { DondeComer } from '../../shared/donde-comer';

import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-where-eat',
  templateUrl: './where-eat.page.html',
  styleUrls: ['./where-eat.page.scss'],
})
export class WhereEatPage implements OnInit {

	eat: DondeComer[];

  constructor(private database: DatabaseService) { }

  ngOnInit() {
  	this.getWhereEat();
  }

  async getWhereEat() {
        let s = this.database.getEat();
        // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
        // último pasamos los datos a JSON
        s.snapshotChanges().subscribe(data => {
                this.eat = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.eat.push(a as DondeComer);
                })            
            }),
            err => console.log(err)
}


}
