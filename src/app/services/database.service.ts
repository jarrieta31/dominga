import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CircuitsModel } from '../models/circuits';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  getCircuits(){
	return this.http.get('https://appdominga.firebaseio.com/circuito.json');
}

getPlaces(){
	return this.http.get('https://appdominga.firebaseio.com/lugares.json');
}

// getUsers(id: string){
// 	return this.http.get('https://appdominga.firebaseio.com/users/');
// }

addCircuits(circuits: CircuitsModel){
	var formulario = {nombre: circuits.nombre, descripcion: circuits.descripcion};
	return this.http.post('https://appdominga.firebaseio.com/circuito.json', formulario);
}

 
}
