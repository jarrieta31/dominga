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
import { isEmpty, map } from "rxjs/operators";
import { Eventos } from "../shared/eventos";
import { Departament } from "../shared/departament";
import { loadavg, type } from "os";
import { log } from "console";
import { async } from "@angular/core/testing";

export interface Visita {
  id?             : string;
  total_visitas    : number;
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

/**
 * funcion publica. recibe los datos del controlador.
 * Guarda le parametro recibido en un array global "visitas : string[]".
 * Revisa que no se repita le parametro recibido.
 * Pasa el parametro a la funcion getVisita(id: string)
 * @param id : string. 
 * Recibe el id de un Evento.
 */
  contadorVisitas( id: string){
    let control : boolean = false;
    if(this.visitas.length == 0) {
      this.visitas.push(id);
      this.getVisita(id);
    }else{
      this.visitas.forEach( v => { 
        if(v === id){
          control = !control;
        }
      })
      if(!control) {
        this.visitas.push(id);
        this.getVisita(id);
      }

      
      
      //   this.visitas.push(id);
      // console.log(this.visitas);
    }
    
  }

/**
 * Recibe los parametros de getVisita( evento_id : string )
 * Se encarga de revisar el parametro visita recibido, luego llama a los 
 * metodos para incrementar o crear la visita.
 * @param visita : interfaz Visita.
 * @param evento_id : string
 */
  private sumarVisitaEvento( visita : Visita, evento_id? : string ){
    
    if( typeof visita != 'undefined' ){
      let cantDiasVisita = visita.dia_visita.length
      if(this.hoyTieneVisita(visita.dia_visita[cantDiasVisita-1])){
        this.sumarVisita(visita.dia_visita[cantDiasVisita-1])
        this.sumarTotalVisita(visita);
        this.actulizarVisita(visita);
      }else{
        this.agregarDiaVisita(visita.dia_visita);
        this.sumarTotalVisita(visita);
        this.actulizarVisita(visita);
      }
    }else{
      this.crearVisita( evento_id );
      console.log(`entrando a crear visita para el evento`);
      
    }
    
  }
/**
 * Funcion privada. Crea una objeto de Visita, y luego lo inserta en la BD.
 * @param evento_id : string
 */
  private crearVisita( evento_id : string ){
    let visita: Visita = {
      "id_evento"     : evento_id,
      "total_visitas" :  1 ,
      "dia_visita"  : [{ 
        "dia"        : this.getToday(),
        "cant_visita" : 1
      }]
    }
    this.afs.collection('visitas').add(visita);
  }

/**
 * Esta funcion se encarga de traer una visita asociada a un evento y 
 * setear la variable global visita: Vista.
 * En el caso de que no exista una visita para ese evento, setea la 
 * variable global en null.
 * @param evento_id 
 * Es de tipo string.
 */
  getVisita( evento_id : string )  {
    this.afs.collection('visitas')
        .ref.where("id_evento", "==",evento_id )
        .get()
        .then( querySnapshot => {
          const arrVisita: any[] = [];
          querySnapshot.forEach((item) => {
          const data : any = item.data();
              arrVisita.push({ id: item.id, ...data })
          })
          this.visita = arrVisita[0]; 
          this.sumarVisitaEvento(this.visita, evento_id);
        })
        .catch((err) => {
          console.error("Error en al traer la visita" + err);
        })
        .finally(() => console.log("Finally"));
        
  }
  
/**
 * Funcion privada. Se encarga de actulizar un objeto de la BD de tipo visita
 * @param visita : interfaz Visita
 */
  private actulizarVisita( visita : Visita ){
    
    let total_visitas : number = visita.total_visitas;
    let dia_visita    : DiaVisita[] = visita.dia_visita;

  this.afs.doc( `visitas/${visita.id}` )
    .update({
        total_visitas,
        dia_visita
    })
    .then( )
    .catch((err) => {
      console.error("Error en al traer la visita" + err)
    })
  }
/**
 * funcion privada. Se encarga de crear una instancia de tipo Date con 
 * la fecha actual.
 * @returns Date 
 */
  private getToday() : Date  {
    let aux : Date = new Date();
    let dd         = aux.getDate();
    let mm         = aux.getMonth();
    let aa         = aux.getFullYear();
    return new Date(aa, mm, dd);
  }
/**
 * funcion privada. Se encarga de comparar si la fecha de la ultima visita realizada 
 * es igual a la fecha actual.
 * @param ultimaVisita : interfaz DiaVisita
 * @returns boolean
 */
  private hoyTieneVisita( ultimaVisita : DiaVisita ) : boolean {
    
    let diaVisita  = new Date(ultimaVisita.dia['seconds'] * 1000);
    let hoy        = this.getToday();

    if( +hoy === +diaVisita ) return true;
    else return false;
    }

/**
 * Funcion que devuelve un nuevo objeto de tipo interfaz DiaVisita.
 * @returns Devuelve un Objeto de tipo DiaVisita.
 * La cant_visita = 1, porque se asume que al crear este elemento
 * es debido a la primera visita del dia.
 * dia = Al dia actual de formato anio/mes/dia. Ver getToday()
 */
  private crearDiaVisita( ): DiaVisita {
    
    const visita : DiaVisita = {
      cant_visita : 1,
      dia : this.getToday()
    }
    return visita;
  }  
/**
 * funcion privada. Agrega al arreglo un nuevo dia de visita para el evento asociado, 
 * retornando un array de DiaVisita.
 * @param visitas : array de interfaz DiaVisita[]
 * @returns array de interfaz DiaVisita[]
 */
  private agregarDiaVisita( visitas : DiaVisita[] ) : DiaVisita[] {
    visitas.push(this.crearDiaVisita());
    return visitas;
  }
/**
 * funcion privada. Se encarga de +1 a la variable cant_visita
 * @param ultimaVisita : interfaz DiaVisita
 * @returns interfaz DiaVisita
 */
  private sumarVisita( ultimaVisita : DiaVisita ) : DiaVisita {
    
    ultimaVisita.cant_visita++;
    return ultimaVisita;

  }
/**
 * funcion privada. Se encarga de +1 a la variable total_visitas
 * @param visitas : interfaz Visita
 * @returns interfaz Visita
 */
  private sumarTotalVisita( visitas : Visita ) : Visita {
    visitas.total_visitas++;
    return visitas;
  }
}

