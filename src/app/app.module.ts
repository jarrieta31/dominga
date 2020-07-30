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

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ComponentsModule } from './components/components.module';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
    ComponentsModule,    

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
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // AuthService,
    // AngularFireAuth,
    // AngularFirestore
    Network,
    Keyboard,
    CallNumber,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
