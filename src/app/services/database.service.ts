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
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Eventos } from "../shared/eventos";



@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  appsRef: AngularFireList<any>;
  rating = this.db.database.ref("lugar");

  eventos: Subject<Eventos[]>;
  allEvents: Eventos[] = [];  
  today: Date = new Date();

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(private db: AngularFireDatabase, private afs: AngularFirestore) {
    this.eventos = new Subject();
    this.getEventos();
  }

  getEventos() {
    this.afs.collection("evento").ref.where("fecha", ">=", this.today).orderBy("fecha", "asc").get().then(
      querySnapshot => {
        const arrEvents: any[] = [];
        querySnapshot.forEach( item =>  {
          const data: any = item.data();
          arrEvents.push( {id: item.id, ...data} );
        });
        this.allEvents = arrEvents;
        this.eventos.next(this.allEvents);
        this.allEvents.forEach( f => {
          f.fecha = new Date(f.fecha["seconds"] * 1000);
        })
      }
    ).catch( err => {
      console.log(err)
    }).finally( () => console.log("Finally"))
  }

  getObservable(): Observable<Eventos[]> {
    return this.eventos.asObservable();
  }

  getEventsLocal() {
    this.eventos.next(this.allEvents);
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
}
