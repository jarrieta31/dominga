import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

	loading: any;

  constructor(
  	public loadingCtrl: LoadingController
  	) { }

  	async show(message: string) {
      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
        //duration: 3000
      });

      return this.loading.present();
    }

  hide() {
  	setTimeout(() => {
            this.loading.dismiss();
        }, 2000);
	}
}
