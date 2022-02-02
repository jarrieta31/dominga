import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { Eventos } from "../shared/eventos";
import { Departament } from "../shared/departament";
import { TwoPoints } from "src/app/shared/two-points";
import { Subscription } from "rxjs";
import { GeolocationService } from "./geolocation.service";
import { tap } from "rxjs/operators";

// export interface VisitaEvento {
//   id?: string;
//   total_visitas: number;
//   id_evento: string;
//   visita_xdia: DiaVisita[];
// }

// export interface VisitaPlace {
//   id?: string;
//   total_visitas: number;
//   id_place: string;
//   visita_xmes: MesVisita[];
// }

// export interface DiaVisita {
//   dia: Date;
//   cant_vta_xdia: number;
// }

// export interface MesVisita {
//   mes: string;
//   cant_vta_xmes: number;
//   visita_xdia: DiaVisita[];
// }

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  // Usamos el Servicio 'AngularFireList' de Angular Fire para listar los datos
  appsRef: AngularFireList<any>;
  rating = this.db.database.ref("lugar");

  today: Date = new Date();

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private geoService: GeolocationService
  ) {
    this.position$ = this.geoService.getPosicionActual$();
    this.eventos = new Subject();
    this.getEventos();
    // this.getLugares();

    /**
     * Calcular distancia desde ubicación del usuario a lugares
     */
    // this.sourceMatch$ = timer(1000, 5000).pipe(
    //   tap(() => {
    //console.log("distancia");
    //console.log(this.selection);
    // this.allLugares.forEach((res) => {
    //   let maxmin: TwoPoints = {
    //     longitud1: res.ubicacion.lng,
    //     latitud1: res.ubicacion.lat,
    //     longitud2: -56.7061826207969,
    //     latitud2: -34.33806617025381,
    //   };
    //console.log(this.geoService.calculateDistance(maxmin));
    // this.currentPosition$ = this.position$
    // .pipe(
    // tap((posicion) => {
    //   if (posicion != null){
    //     console.log(posicion);
    //   }
    //   else console.log(posicion)
    // }));
    //console.log(this.allLugares);
    // });
    // })
    // );
  }

  eventos: Subject<Eventos[]>;
  allEvents: Eventos[] = [];

  currentPosition$: Subscription;
  position$: Observable<any>;

  selectionDepto: String | null = null;
  selectionDistance: number | null = null;

  /**
   * Departamento o distancia seleeccionado en la pantalla inicial
   */
  getSelectMenu(depto: String | null, distance: number | null) {
    if (depto == null) {
      this.selectionDistance = distance;
      this.selectionDepto = null;
    } else {
      this.selectionDepto = depto;
      this.selectionDistance = null;
    }
  }
 
  /**
   * Obtener eventos desde fecha de hoy
   */
  
  getEventos() {
    this.afs
      .collection("eventos")
      .ref
      .where("departamento", "==", this.selectionDepto  )
      .where("fechaInicio", ">=", this.today)
      .orderBy("fechaInicio", "asc")
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
          f.descripcion = this.limpiarTexto(f.descripcion);
          f.fechaInicio = new Date(f.fechaInicio["seconds"] * 1000);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => "Finally");
  }

  getObservable(): Observable<Eventos[]> {
    return this.eventos.asObservable();
  }

  getEventsLocal() {
    this.eventos.next(this.allEvents);
  }

  allDepartament: Departament[] = [];
  departamentosActivos: BehaviorSubject<Departament[]>;
  /**
   * Obtener departamentos activos
   */
  getDepartamentosActivos() {
    this.allDepartament = [];
    this.departamentosActivos = new BehaviorSubject<Departament[]>(this.allDepartament);

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
        this.departamentosActivos.next(this.allDepartament);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => "Finally");
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

  limpiarTexto( text : string) : string{
    let _txt : string;
    _txt = text.replace(/<[^>]*>?/g, '');
    const base64 = window.btoa(_txt);
    console.log(base64);
    
    text = window.atob(base64);
    return text;
  }
    // >>>>>>>>>>>>>  :: CONTADOR VISITAS A EVENTOS :: <<<<<<<<<<<<<<<<<<<
    /**
   * funcion publica. recibe los datos del controlador.
   * Guarda le parametro recibido en un array global "visitas : string[]".
   * Revisa que no se repita le parametro recibido.
   * Pasa el parametro a la funcion getVisita(id: string)
   * @param id : string.
   * Recibe el id de un Evento.
   */
  // contadorVisitasEvento(id: string) {
  //   let control: boolean = false;
  //   if (this.visitasAEventos.length == 0) {
  //     this.visitasAEventos.push(id);
  //     this.getVisita(id);
  //   } else {
  //     this.visitasAEventos.forEach((v) => {
  //       if (v === id) {
  //         control = !control;
  //       }
  //     });
  //     if (!control) {
  //       this.visitasAEventos.push(id);
  //       this.getVisita(id);
  //     }
  //   }
  // }

  // /**
  //  * Recibe los parametros de getVisita( evento_id : string )
  //  * Se encarga de revisar el parametro visita recibido, luego llama a los
  //  * metodos para incrementar o crear la visita.
  //  * @param visita : interfaz Visita.
  //  * @param evento_id : string
  //  */
  // private sumarVisitaEvento(visita: VisitaEvento, evento_id?: string) {
  //   if (typeof visita != "undefined") {
  //     let cantDiasVisita = visita.visita_xdia.length;
  //     this.sumarVisitaXDia(visita.visita_xdia);
  //     this.incrementarTotalVisitaXEvento(visita);
  //     this.actulizarVisita(visita);
  //   } else {
  //     this.crearVisita(evento_id);
  //     console.log(`entrando a crear visita para el evento`);
  //   }
  // }
  // /**
  //  * Funcion privada. Crea una objeto de Visita, y luego lo inserta en la BD.
  //  * @param evento_id : string
  //  */
  // private crearVisita(evento_id: string) {
  //   let visita: VisitaEvento = {
  //     id_evento: evento_id,
  //     total_visitas: 1,
  //     visita_xdia: [
  //       {
  //         dia: this.getToday(),
  //         cant_vta_xdia: 1,
  //       },
  //     ],
  //   };
  //   this.afs.collection("visitas_evento").add(visita);
  // }

  // /**
  //  * Esta funcion se encarga de traer una visita asociada a un evento y
  //  * setear la variable global visita: Vista.
  //  * En el caso de que no exista una visita para ese evento, setea la
  //  * variable global en null.
  //  * @param evento_id
  //  * Es de tipo string.
  //  */
  // getVisita(evento_id: string) {
  //   this.afs
  //     .collection("visitas_evento")
  //     .ref.where("id_evento", "==", evento_id)
  //     .get()
  //     .then((querySnapshot) => {
  //       const arrVisita: any[] = [];
  //       querySnapshot.forEach((item) => {
  //         const data: any = item.data();
  //         arrVisita.push({ id: item.id, ...data });
  //       });
  //       this.visita_evento = arrVisita[0];
  //       this.sumarVisitaEvento(this.visita_evento, evento_id);
  //     })
  //     .catch((err) => {
  //       console.error("Error en al traer la visita" + err);
  //     })
  //     .finally(() => console.log("Finally"));
  // }

  // /**
  //  * Funcion privada. Se encarga de actulizar un objeto de la BD de tipo visita
  //  * @param visita : interfaz Visita
  //  */
  // private actulizarVisita(visita: VisitaEvento) {
  //   let total_visitas: number = visita.total_visitas;
  //   let visita_xdia: DiaVisita[] = visita.visita_xdia;

  //   this.afs
  //     .doc(`visitas_evento/${visita.id}`)
  //     .update({
  //       total_visitas,
  //       visita_xdia,
  //     })
  //     .then()
  //     .catch((err) => {
  //       console.error("Error en al traer la visita" + err);
  //     });
  // }
  /**
   * funcion privada. Se encarga de crear una instancia de tipo Date con
   * la fecha actual.
   * @returns Date
   */
  // getToday(): Date {
  //   let aux: Date = new Date();
  //   let dd = aux.getDate();
  //   let mm = aux.getMonth();
  //   let aa = aux.getFullYear();
  //   return new Date(aa, mm, dd);
  // }

  // getMonth(): string {
  //   let aux: Date = new Date();
  //   let mes: string = aux.toLocaleString("default", { month: "long" });
  //   return mes;
  // }

  /**
   * funcion privada. Se encarga de comparar si la fecha de la ultima visita realizada
   * es igual a la fecha actual.
   * @param ultimaVisita : interfaz DiaVisita
   * @returns boolean
   */
  // public hoyTieneVisita(ultimaVisita: DiaVisita): boolean {
  //   let diaVisita = new Date(ultimaVisita.dia["seconds"] * 1000);
  //   let hoy = this.getToday();

  //   if (+hoy === +diaVisita) return true;
  //   else return false;
  // }

  // /**
  //  * Funcion que devuelve un nuevo objeto de tipo interfaz DiaVisita.
  //  * @returns Devuelve un Objeto de tipo DiaVisita.
  //  * La cant_vta_xdia = 1, porque se asume que al crear este elemento
  //  * es debido a la primera visita del dia.
  //  * dia = Al dia actual de formato anio/mes/dia. Ver getToday()
  //  */
  // private crearDiaVisita(): DiaVisita {
  //   const visita: DiaVisita = {
  //     cant_vta_xdia: 1,
  //     dia: this.getToday(),
  //   };
  //   return visita;
  // }
  // /**
  //  * crea y retorna una copia de MesVisita.
  //  * @returns interfaz MesVisita
  //  */
  // private crearMesVisita(): MesVisita {
  //   const mesvisita: MesVisita = {
  //     cant_vta_xmes: 1,
  //     mes: this.getMonth(),
  //     visita_xdia: [this.crearDiaVisita()],
  //   };
  //   return mesvisita;
  // }
  // /**
  //  * funcion privada. Agrega al arreglo un nuevo dia de visita para el evento asociado,
  //  * retornando un array de DiaVisita.
  //  * @param visitas : array de interfaz DiaVisita[]
  //  * @returns array de interfaz DiaVisita[]
  //  */
  // private agregarDiaVisita(visitas: DiaVisita[]): DiaVisita[] {
  //   visitas.push(this.crearDiaVisita());
  //   return visitas;
  // }
  // /**
  //  * funcion privada. Se encarga de +1 a la variable cant_vta_xdia
  //  * @param ultimaVisita : interfaz DiaVisita
  //  * @returns interfaz DiaVisita
  //  */
  // private incrementarVisitaXDia(ultimaVisita: DiaVisita): DiaVisita {
  //   ultimaVisita.cant_vta_xdia++;
  //   return ultimaVisita;
  // }
  // /**
  //  * funcion privada. Se encarga de +1 a la variable total_visitas
  //  * @param visitas : interfaz Visita
  //  * @returns interfaz Visita
  //  */
  // private incrementarTotalVisitaXEvento(visitas: VisitaEvento): VisitaEvento {
  //   visitas.total_visitas++;
  //   return visitas;
  // }

  // >>>>>>>>>>>>>  :: CONTADOR VISITAS A LUGARES  :: <<<<<<<<<<<<<<<<<<<
  /**
  //  * Funcion publica que es accedida por el controlador.
  //  * Se encarga de controlar que no se sume mas de una visita del mismo usuario por sesion.
  //  * @param place_id : string ID del lugar que se visita. Recibe ese valor desde el card
  //  * que muestra la informacion del lugar. Este valor viene por la url.
  //  */
  // contadorVistasPlace(place_id: string) {
  //   let control: boolean = false;
  //   if (this.visitasALugares.length == 0) {
  //     this.visitasALugares.push(place_id);
  //     this.getVisitasLugar(place_id);
  //   } else {
  //     this.visitasALugares.forEach((v) => {
  //       if (v === place_id) {
  //         control = !control;
  //       }
  //     });
  //     if (!control) {
  //       this.visitasALugares.push(place_id);
  //       this.getVisitasLugar(place_id);
  //     }
  //   }
  // }
  // /**
  //  * Funcion privada, Inserta en la BD una nueva instancia de Visita a Lugar.
  //  * @param place_id : string.
  //  */
  // private createVisitaLugar(place_id: string) {
  //   let place: VisitaPlace = {
  //     id_place: place_id,
  //     total_visitas: 1,
  //     visita_xmes: [this.crearMesVisita()],
  //   };
  //   this.afs.collection("visitas_lugares").add(place);
  // }
  // /**
  //  * funcion Privada, se encarga de traer el registro de la tabla 'visitas_lugares' que
  //  * contega el valor que contenga la variable 'place_id'.
  //  * se asume que siempre va a existir un registro.
  //  * @param place_id : string
  //  */
  // private getVisitasLugar(place_id: string) {
  //   this.afs
  //     .collection("visitas_lugares")
  //     .ref.where("id_place", "==", place_id)
  //     .get()
  //     .then((querySnapshot) => {
  //       const arrVisita: any[] = [];
  //       querySnapshot.forEach((item) => {
  //         const data: any = item.data();
  //         arrVisita.push({ id: item.id, ...data });
  //       });
  //       this.visita_lugar = arrVisita[0];
  //       this.sumarVisitaLugar(this.visita_lugar, place_id);
  //     })
  //     .catch((err) => {
  //       console.error(
  //         "Error en al traer la informacion de Place ::getVisitasLugar" + err
  //       );
  //     })
  //     .finally(() => console.log("Finally"));
  // }
  // /**
  //  * Funcion privada. Se encarga de actualizar los registros de Visitas a Lugares.
  //  * @param visitaLugar : tipo Interfaz VisitaPlace
  //  */
  // private updateVisitaLugar(visitaLugar: VisitaPlace) {
  //   let total_visitas: number = visitaLugar.total_visitas;
  //   let visita_xmes: MesVisita[] = visitaLugar.visita_xmes;
  //   this.afs
  //     .doc(`visitas_lugares/${visitaLugar.id}`)
  //     .update({
  //       total_visitas,
  //       visita_xmes,
  //     })
  //     .then((a) => {
  //       console.info("Success al ::ACTUALIZAR:: el registro " + a);
  //     })
  //     .catch((err) => {
  //       console.error("Error al ::ACTUALIZAR:: la visita " + err);
  //     });
  // }
  // /**
  //  * Se encarga de actulizar el registro de la visita al lugar si este existe, o de
  //  * crear uno nuevo.
  //  * @param visitaLugar
  //  * @param place_id
  //  */
  // private sumarVisitaLugar(visitaLugar: VisitaPlace, place_id?: string) {
  //   if (typeof visitaLugar != "undefined") {
  //     this.sumarVisitaXMes(visitaLugar.visita_xmes);
  //     this.incrementarTotalVisitasLugar(visitaLugar);
  //     this.updateVisitaLugar(visitaLugar);
  //   } else {
  //     this.createVisitaLugar(place_id);
  //   }
  // }

  // private sumarVisitaXMes(visita_xmes: MesVisita[]): MesVisita[] {
  //   let cant_meses = visita_xmes.length;
  //   if (this.esteMesTieneVisita(visita_xmes[cant_meses - 1])) {
  //     this.sumarVisitaXDia(visita_xmes[cant_meses - 1].visita_xdia);
  //     this.incrementarTotalVisitasXMes(visita_xmes[cant_meses - 1]);
  //   } else {
  //     this.agregarMesVisita(visita_xmes);
  //   }
  //   return visita_xmes;
  // }
  // /**
  //  * Se encarga de actulizar la visita realizada en dia para ese luegar, o de
  //  * crear una visita para ese dia.
  //  * @param visita_xdia
  //  * @returns
  //  */
  // private sumarVisitaXDia(visita_xdia: DiaVisita[]): DiaVisita[] {
  //   let cant_dia = visita_xdia.length;
  //   if (this.hoyTieneVisita(visita_xdia[cant_dia - 1])) {
  //     this.incrementarVisitaXDia(visita_xdia[cant_dia - 1]);
  //   } else {
  //     this.agregarDiaVisita(visita_xdia);
  //   }
  //   return visita_xdia;
  // }
  // /**
  //  * Revisa si el Place tiene visitas este mes.
  //  * @param mesVisita
  //  * @returns
  //  */
  // private esteMesTieneVisita(mesVisita: MesVisita): boolean {
  //   let mesActual = new Date().toLocaleString("default", { month: "long" });
  //   if (mesActual === mesVisita.mes) return true;
  //   else return false;
  // }

  // private agregarMesVisita(visita_xmes: MesVisita[]): MesVisita[] {
  //   visita_xmes.push(this.crearMesVisita());
  //   return visita_xmes;
  // }
  // /**
  //  * Incrementa el contador (+1) de visitas por mes, actualizando el total de visitas
  //  * realizadas en ese mes.
  //  * @param mesVisita
  //  * @returns
  //  */
  // private incrementarTotalVisitasXMes(mesVisita: MesVisita): MesVisita {
  //   mesVisita.cant_vta_xmes++;
  //   return mesVisita;
  // }
  // /**
  //  * Incrementa el contador (+1) de visitas, actualizando el total de visitas
  //  * realizadas al Lugar.
  //  * @param visitaLugar
  //  * @returns
  //  */
  // private incrementarTotalVisitasLugar(visitaLugar: VisitaPlace): VisitaPlace {
  //   visitaLugar.total_visitas++;
  //   return visitaLugar;
  // }
}
