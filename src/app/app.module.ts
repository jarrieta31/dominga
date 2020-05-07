import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PipesModule } from './shared/pipes/pipes.module';

// Imports para cliente http
import { HttpClientModule } from '@angular/common/http';

// Import enviroments
import { environment } from '../environments/environment';

// Importas para geolocalización
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

//import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

// Almacenamiento de datos 
//import { IonicStorageModule } from '@ionic/storage';

// Imports para firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
//Permisos
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//Plataforma
import { Platform } from '@ionic/angular';

import { IonicRatingModule } from 'ionic-rating';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// import { AuthService } from './services/auth.service';

// import { AngularFireAuth } from '@angular/fire/auth';


// import { AngularFireModule } from '@angular/fire';

// import { environment } from '../environments/environment';

// import { AngularFirestore } from '@angular/fire/firestore';

// import { AngularFireDatabaseModule } from '@angular/fire/database';

//install firebase @angular/fire --save


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    PipesModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    IonicRatingModule
    //IonicStorageModule.forRoot()
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationAccuracy,
    Platform,
    AndroidPermissions,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    // AuthService,
    // AngularFireAuth,
    // AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
