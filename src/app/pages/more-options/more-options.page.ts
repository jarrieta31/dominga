import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

import { DondeComer } from '../../shared/donde-comer';
import { DondeDormir } from '../../shared/donde-dormir';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.page.html',
  styleUrls: ['./more-options.page.scss'],
})
export class MoreOptionsPage implements OnInit {

	sleep:  DondeDormir[];
	eat: DondeComer[];

	textoBuscar = '';

	dormir = this.database.getSleep().snapshotChanges().subscribe( res => {
		this.sleep = [];
                res.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.sleep.push(a as DondeDormir);
                })
	})

	comer = this.database.getEat().snapshotChanges().subscribe( res => {
		this.eat = [];
                res.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.eat.push(a as DondeComer);
                })

                this.sleep;
                this.sleep = this.sleep.concat(this.eat);
                console.log(this.sleep);
	})

  constructor(private database: DatabaseService) { }

  ngOnInit() {
  	this.comer;
  }

  ngOnDestroy() {
  	this.comer.unsubscribe();
  }

  buscar( event ){
        this.textoBuscar = event.detail.value;
    }

}
