import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Favourite } from '../../shared/favourite';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  favourite: Favourite[];

  users = null;

  su = this.database.getFavouriteUser(this.users).snapshotChanges().subscribe(data => {
                this.favourite = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.favourite.push(a as Favourite);
                })
                console.log(this.favourite);
            });

  constructor(
    public database: DatabaseService,
    public authSvc: AuthService
    ) { }

  ngOnInit() {
    this.authSvc.currentUser.subscribe( authData =>{
            //console.log(authData);
            this.users = authData.uid;
            //console.log(this.users);
        });
    this.su;
  }

  ngOnDestroy(){
    this.su.unsubscribe();
  }


}
