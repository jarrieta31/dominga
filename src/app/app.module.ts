import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Imports para cliente http
import { HttpClientModule } from '@angular/common/http';

// Importas para geolocalización
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

// Almacenamiento de datos 
import { IonicStorageModule } from '@ionic/storage';
//import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
