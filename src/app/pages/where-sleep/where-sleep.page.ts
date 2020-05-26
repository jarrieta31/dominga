import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { DondeDormir } from '../../shared/donde-dormir';

@Component({
    selector: 'app-where-sleep',
    templateUrl: './where-sleep.page.html',
    styleUrls: ['./where-sleep.page.scss'],
})
export class WhereSleepPage implements OnInit {

    sleep: DondeDormir[];
    textoBuscar = '';
    items: any[] = [];

    su = this.database.getSleep().snapshotChanges().subscribe(data => {
        this.sleep = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.sleep.push(a as DondeDormir);
        })
    });

    constructor(private database: DatabaseService) {
        this.su;
        
    }

    

    ngOnInit() {
        
    
    }

    ngOnDestroy(){
        this.su.unsubscribe();
    }

    buscar( event ){
        this.textoBuscar = event.detail.value;
    }

    

}