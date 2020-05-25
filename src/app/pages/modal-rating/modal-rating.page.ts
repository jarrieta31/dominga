

import { Component, Input , Output, EventEmitter} from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-modal-rating',
    templateUrl: './modal-rating.page.html',
    styleUrls: ['./modal-rating.page.scss'],
})
export class ModalRatingPage {

    nombre: string;
    key: string;
    imagen: string;
    tipo: string;
    rate: number;
    users: string;

    @Input() rating: number;

    user = this.authSvc.currentUser.subscribe(authData => {
        this.users = authData.uid;
    });

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        private database: DatabaseService,
        private platform: Platform,
        private vibration: Vibration,
        private authSvc: AuthService) {}

    ngOnInit() {
        //console.table(this.navParams);
        this.nombre = this.navParams.data.nombre;
        this.key = this.navParams.data.key;
        this.tipo = this.navParams.data.tipo;
        this.imagen = this.navParams.data.imagen;
        this.user;
        //Si es un dispositivo móvil vibra al lazar el modal
        if(this.platform.is('android')){
          this.vibration.vibrate([500,500,500]);
        }
    }

    ngOnDestroy(){
      this.user.unsubscribe();
    }

    async closeModal() {
        const onClosedData: string = "Wrapped Up!";
        await this.modalController.dismiss(onClosedData);
    }

    async puntuacion(rating) {
        this.database.removeRatingDefault(this.key);
        this.rate = rating;
        this.database.addRating(this.key, this.rate, this.users)
        await this.modalController.dismiss();
    }
}

