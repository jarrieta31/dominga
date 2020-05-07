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
  textoBuscar = '';

  users: string;

  su = this.authSvc.currentUser.subscribe( authData =>{
            //console.log(authData);
            this.users = authData.uid;
            this.getFavUser();
            //console.log(this.users);
        });

  constructor(
    public database: DatabaseService,
    public authSvc: AuthService
    ) { }

  ngOnInit() {
    this.su;
  }

  ngOnDestroy(){
    this.su.unsubscribe();
  }

  getFavUser(){
    this.database.getFavouriteUser(this.users).snapshotChanges().subscribe(data => {
                this.favourite = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.favourite.push(a as Favourite);
                })
                //console.log(this.favourite);
            });
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }
}
