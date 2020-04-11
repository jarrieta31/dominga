import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { TipoCircuito } from '../shared/tipo-circuito';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
    appsRef: AngularFireList < any > ;

    // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
    constructor(private http: HttpClient, private db: AngularFireDatabase) {}

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

    getTypeCircuits() {
        this.appsRef = this.db.list('tipo_circuito');
        return this.appsRef;
    }

    // getUsers(id: string){
    // 	return this.http.get('https://appdominga.firebaseio.com/users/');
    // }

    // addCircuits(circuits: CircuitsModel) {
    //     var formulario = { nombre: circuits.nombre, descripcion: circuits.descripcion };
    //     return this.http.post('https://appdominga.firebaseio.com/circuito.json', formulario);
    // }


}