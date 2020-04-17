import { Component, OnInit, OnDestroy } from '@angular/core';

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

  su = this.database.getEat().snapshotChanges().subscribe(data => {
                this.eat = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.eat.push(a as DondeComer);
                })            
            });

  ngOnInit() {
  	this.su;
  }

  ngOnDestroy(){
    this.su.unsubscribe();
  }

}
