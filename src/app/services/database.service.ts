import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { TipoCircuito } from '../shared/tipo-circuito';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
    appsRef: AngularFireList < any > ;
    dbRef = this.db.database.ref('usuario_favoritos');
    rating = this.db.database.ref('lugar');
    //darkMode = this.db.database.ref('usuario_modo');

    // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
    constructor(private db: AngularFireDatabase) { }

    // En nuestra función listarDatos() especificamos la colección de datos de Firebase Database Realtime que
    // queremos usar, la colección que usaremos se llama 'tipo_circuito'
    listarDatos() {
        this.appsRef = this.db.list('tipo_circuito');
        return this.appsRef;
    }

    getPlaces() {
        this.appsRef = this.db.list('lugar');
        return this.appsRef;
    }

    getSleep() {
        this.appsRef = this.db.list('donde_dormir');
        return this.appsRef;
    }

    getEat() {
        this.appsRef = this.db.list('donde_comer');
        return this.appsRef;
    }

    getParty() {
        this.appsRef = this.db.list('casa_de_fiesta');
        return this.appsRef;
    }

    getTypeCircuits() {
        this.appsRef = this.db.list('tipo_circuito');
        return this.appsRef;
    }

    getFavouriteUser(uid: string) {
        this.appsRef = this.db.list('usuario_favoritos/' + uid);
        return this.appsRef;
    }

    addFavourite(nombreLugar: string, id: string, uid: string,
        imagenLugar: string, tipo: string) {
        this.dbRef.child(uid + '/' + id).set({
            nombre: nombreLugar,
            imagen: imagenLugar,
            tipo: tipo
        });
    }

    removeFavourite(uid: string, id: string) {
        this.dbRef.child(uid + '/' + id).remove();
    }

    removeRatingDefault(idLugar: string) {
        this.rating.child(idLugar + '/valoracion/user').remove();
    }

    addRating(lugar: string, rate: number, uid: string) {
        this.rating.child(lugar + '/valoracion/' + uid).set(
            rate
        );   
    }

    //Función para agregar array valoracion a cada lugar con valor default que luego
    //será eliminado cuando un usuario realice la primera valoración sobre el lugar
    //this.addValorar(idLugar, 0);
    
    // addValorar(id: string, rate: number){
    //         this.rating.child(id + '/valoracion/user').set(
    //         rate
    //     ); 
    // }

    // changeMode(id: string, dark: boolean){
    //     if(dark){
    //          this.darkMode.child('/' + id).set(
    //         'dark'
    //         ); 
    //     } else {
    //         this.darkMode.child('/' + id).remove();
    //     } 
    // }

    // checkMode(id: string){
    //     this.appsRef = this.db.list('usuario_modo');
    //     return this.appsRef;
    // }
}