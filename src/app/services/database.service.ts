import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

import { TipoCircuito } from "../shared/tipo-circuito";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

type Collection<T> = string | AngularFirestoreCollection;

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  appsRef: AngularFireList<any>;
  rating = this.db.database.ref("lugar");

  //darkMode = this.db.database.ref('usuario_modo');

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(private db: AngularFireDatabase, private afs: AngularFirestore) {
    // this.addEvent();
  }

  // dataEvento: any = {
  //   nombre:'Evento 8',
  //   fecha: "07/11/2021",
  //   hora: "13:00 hs",
  //   dia: "11/07/2021 13:00",
  //   descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing",
  //   departamento: "San José",
  //   localidad: "Libertad",
  //   imagen:
  //     "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009677/bannner_web1.jpg",
  // };

  // public generaCadenaAleatoria(n: number): string {
  //   let result = '';
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  //   for (let i = 0; i < n; i++){
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  private col<T>(ref: Collection<T>, queryFn?): AngularFirestoreCollection {
    return typeof ref === "string" ? this.afs.collection(ref, queryFn) : ref;
  }

  getCollection<T>(ref: Collection<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn)
      .stateChanges()
      .pipe(
        map((docs) => {
          return docs.map((d) => {
            const data = d.payload.doc.data();
            const id = d.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  // async addEvent(){
  //   const newEvent = this.afs.collection('evento').doc(this.generaCadenaAleatoria(15));
  //   await newEvent.set(this.dataEvento);

  // }

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
