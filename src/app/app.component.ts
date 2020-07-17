import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { timer } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    showSplash = true;
    modo: boolean;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,

    ) {

        this.initializeApp();
    }

    initializeApp() {

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            timer(3000).subscribe(() => this.showSplash = false);
            this.checkDarkMode();
        });
    }


    checkDarkMode() {
        if (localStorage.getItem("modoOscuro") == "true") {
            try {
                document.body.classList.toggle('dark')
            } catch (error) {
                console.log(error);
            }
        }
    }




    // if (localStorage.getItem("modoOscuro"))
    //     try {
    //       this.modo = JSON.parse(localStorage.getItem("modoOscuro"));
    //     } catch (error) {
    //       this.modo = false
    //     }

}