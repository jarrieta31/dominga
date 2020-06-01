import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Favourite } from '../../shared/favourite';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit, OnDestroy {

  favourite: Favourite[];
  textoBuscar = '';

  users: string;

  loading: any;

  su = this.authSvc.currentUser.subscribe( authData =>{
            //console.log(authData);
            this.users = authData.uid;
            this.getFavUser();
            //console.log(this.users);
        });

  constructor(
    private database: DatabaseService,
    private authSvc: AuthService,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.show("Cargando favoritos...");
  }

  ngOnDestroy(){
    this.su.unsubscribe();
  }

  async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
     this.loading.present().then(() => {
         this.su;
         this.loading.dismiss();
     });
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
