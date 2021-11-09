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
import { Departament } from "../shared/departament";

export interface Visita {
  id?             : string;
  totalVisitas    : number;
  id_evento        : string;
  dia_visita : DiaVisita[];
}

export interface DiaVisita {
    dia         : Date;
    cant_visita : number;
}


@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  appsRef: AngularFireList<any>;
  rating = this.db.database.ref("lugar");

  today: Date = new Date();

  visita : Visita;

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(private db: AngularFireDatabase, private afs: AngularFirestore) {
    this.eventos = new Subject();
    this.departamentos = new Subject();
    this.getEventos();
    this.getDepartamentosActivos();
    // this.guardarVisita();
    this.getVisita();
  }

  eventos: Subject<Eventos[]>;
  allEvents: Eventos[] = [];
  visitas: string[]=[];
  /**
   * Obtener eventos desde fecha de hoy
   */
  getEventos() {
    this.afs
      .collection("evento")
      .ref.where("fecha", ">=", this.today)
      .orderBy("fecha", "asc")
      .get()
      .then((querySnapshot) => {
        const arrEvents: any[] = [];
        querySnapshot.forEach((item) => {
          const data: any = item.data();
          arrEvents.push({ id: item.id, ...data });
        });
        this.allEvents = arrEvents;
        this.eventos.next(this.allEvents);
        this.allEvents.forEach((f) => {
          f.fecha = new Date(f.fecha["seconds"] * 1000);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => console.log("Finally"));
  }

  getObservable(): Observable<Eventos[]> {
    return this.eventos.asObservable();
  }

  getEventsLocal() {
    this.eventos.next(this.allEvents);
  }


  departamentos: Subject<Departament[]>;
  allDepartament: Departament[] = [];
  /**
   * Obtener departamentos activos
   */
  getDepartamentosActivos() {
    this.afs
      .collection("departamentos")
      .ref.where("status", "==", true)
      .get()
      .then((querySnapshot) => {
        const arrDeptos: any[] = [];
        querySnapshot.forEach((item) => {
          const data: any = item.data();
          arrDeptos.push({ id: item.id, ...data });
        });
        this.allDepartament = arrDeptos;
        this.departamentos.next(this.allDepartament);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => console.log("Finally"));
  }

  getObservableDepartment(): Observable<Departament[]> {
    return this.departamentos.asObservable();
  }

  getDepartamentosLocal() {
    this.departamentos.next(this.allDepartament);
  }

  contadorVisitas( id: string){
    let control : boolean = false;
    if(this.visitas.length == 0) this.visitas.push(id);
    
    this.visitas.forEach( v => { 
      if(v == id){
        control = !control;
      }
    })
    
    if(!control) this.visitas.push(id);
    console.log(this.visitas);
  }



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

  guardarVisita(){
    let fecha : Date = new Date();
    let visita: Visita = {
      "id_evento"     : '0',
      "totalVisitas" :  8 ,
      "dia_visita"  : [{ 
        "dia"        : fecha,
        "cant_visita" : 8
      }]
    }
    this.afs.collection('visitas').add(visita);
  }


   
  getVisita(){
    this.afs.collection('visitas')
        .ref.where("id_evento", "==", "NBgmewrfjEe4EcpnQgvO")
        .get()
        .then( querySnapshot => {
          console.log(querySnapshot);
          
          const arrVisita: any[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrVisita.push({ id: item.id, ...data });
          });
          // this.allDepartament = arrVisita;
          // this.departamentos.next(this.allDepartament);
          this.visita = arrVisita[0];
          console.log(this.visita);
        })
        .catch((err) => {
          console.error("Error en al traer la visita" + err);
        })
        .finally(() => console.log("Finally"));

  }
}

