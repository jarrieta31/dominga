import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { DondeDormir } from '../../shared/donde-dormir';

@Component({
    selector: 'app-where-sleep',
    templateUrl: './where-sleep.page.html',
    styleUrls: ['./where-sleep.page.scss'],
})
export class WhereSleepPage implements OnInit {

    sleep: DondeDormir[];

    constructor(private database: DatabaseService) {}

    ngOnInit() {
        this.getWhereSleep();
    }

    async getWhereSleep() {
        let s = this.database.getSleep();
        // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
        // último pasamos los datos a JSON
        s.snapshotChanges().subscribe(data => {
                this.sleep = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.sleep.push(a as DondeDormir);
                })
            }),
            err => console.log(err)
}

}