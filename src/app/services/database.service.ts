import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

import { TipoCircuito } from "../shared/tipo-circuito";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  appsRef: AngularFireList<any>;
  appsCol: AngularFirestoreCollection<any>;
  appsDoc: AngularFirestoreDocument<any>;
  rating = this.db.database.ref("lugar");
  col = this.dbCloud.collection("evento");
  //darkMode = this.db.database.ref('usuario_modo');

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(
      private db: AngularFireDatabase,
      private dbCloud: AngularFirestore
      ) {
          this.listCollection();
      }

    dataEvento: any = {
        nombre: "Evento 1",
        fecha: "27/09/2021",
        hora: "19:00 hs",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing",
        departamento: "San José",
        imagen: "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009677/bannner_web1.jpg"
    }

    listCollection() {
        this.appsCol = this.col;
        console.log(this.appsCol);
        //return this.appsCol
        //return this.appsCol.add(this.data);
        //return this.appsCol.doc(this.dataEvento.nombre).set(this.dataEvento);
    }
  // En nuestra función listarDatos() especificamos la colección de datos de Firebase Database Realtime que
  // queremos usar, la colección que usaremos se llama 'tipo_circuito'
  listarDatos() {
    this.appsRef = this.db.list("tipo_circuito");
    return this.appsRef;
  }

  getPlaces() {
    this.appsRef = this.db.list("lugar");
    return this.appsRef;
  }

  getSleep() {
    this.appsRef = this.db.list("donde_dormir");
    return this.appsRef;
  }

  getEat() {
    this.appsRef = this.db.list("donde_comer");
    return this.appsRef;
  }

  getParty() {
    this.appsRef = this.db.list("casa_de_fiesta");
    return this.appsRef;
  }

  getTypeCircuits() {
    this.appsRef = this.db.list("tipo_circuito");
    return this.appsRef;
  }

  getSliderInfo() {
    this.appsRef = this.db.list("slider_info");
    return this.appsRef;
  }

  getSliderDondeComer() {
    this.appsRef = this.db.list("slider_donde_comer");
    return this.appsRef;
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
