import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CircuitsModel } from '../models/circuits';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  lugares = environment.firebaseConfig.databaseURL + '/lugar.json';
  lugaresId = environment.firebaseConfig.databaseURL + '/lugar/';

  constructor(private http: HttpClient) { }

  getCircuits(){
	return this.http.get('https://appdominga.firebaseio.com/circuito.json');
}

getPlaces(){
	return this.http.get(this.lugares);
}

getPlacesId(id){
	const url = `${this.lugaresId}${id}.json`;
	return this.http.get(url);
}

getInfoAll(id){
	const url = `${this.lugaresId}${id}.json`;
	return this.http.get(url);
}

// getUsers(id: string){
// 	return this.http.get('https://appdominga.firebaseio.com/users/');
// }

addCircuits(circuits: CircuitsModel){
	var formulario = {nombre: circuits.nombre, descripcion: circuits.descripcion};
	return this.http.post('https://appdominga.firebaseio.com/circuito.json', formulario);
}

 
}
