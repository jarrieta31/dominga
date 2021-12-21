import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TipoDiaVisita as DiaVisita } from 'src/app/shared/tipo-dia-visita';
import { TipoMesVisita as MesVisita } from 'src/app/shared/tipo-mes-visita';
import { VisitEventService } from './visit-event.service';

export interface VisitaPlace {
  id?           :      string;
  total_visitas :      number;
  id_place      :      string;
  visita_xmes   : MesVisita[];
}


@Injectable({
  providedIn: 'root'
})
export class VisitPlaceService {

  visita_lugar: VisitaPlace;
  visitasALugares: string[] = [];


  constructor(
    private afs : AngularFirestore, 
    private ves : VisitEventService
  ) { }

 
  /**
   * Funcion que devuelve un nuevo objeto de tipo interfaz DiaVisita.
   * @returns Devuelve un Objeto de tipo DiaVisita.
   * La cant_vta_xdia = 1, porque se asume que al crear este elemento
   * es debido a la primera visita del dia.
   * dia = Al dia actual de formato anio/mes/dia. Ver getToday()
   */
   private crearDiaVisita(): DiaVisita {
    const visita: DiaVisita = {
      cant_vta_xdia: 1,
      dia: this.ves.getToday(),
    };
    return visita;
  }

  private getMonth(): string {
    let aux: Date = new Date();
    let mes: string = aux.toLocaleString("default", { month: "long" });
    return mes;
  }


/**
   * crea y retorna una copia de MesVisita.
   * @returns interfaz MesVisita
   */
 private crearMesVisita(): MesVisita {
  const mesvisita: MesVisita = {
    cant_vta_xmes: 1,
    mes: this.getMonth(),
    visita_xdia: [this.crearDiaVisita()],
  };
  return mesvisita;
}  
/*
  * Funcion publica que es accedida por el controlador.
  * Se encarga de controlar que no se sume mas de una visita del mismo usuario por sesion.
  * @param place_id : string ID del lugar que se visita. Recibe ese valor desde el card
  * que muestra la informacion del lugar. Este valor viene por la url.
*/
 contadorVistasPlace(place_id: string) {
   let control: boolean = false;
   if (this.visitasALugares.length == 0) {
     this.visitasALugares.push(place_id);
     this.getVisitasLugar(place_id);
   } else {
     this.visitasALugares.forEach((v) => {
       if (v === place_id) {
         control = !control;
       }
     });
     if (!control) {
       this.visitasALugares.push(place_id);
       this.getVisitasLugar(place_id);
     }
   }
 }
 /**
  * Funcion privada, Inserta en la BD una nueva instancia de Visita a Lugar.
  * @param place_id : string.
  */
 private createVisitaLugar(place_id: string) {
   let place: VisitaPlace = {
     id_place: place_id,
     total_visitas: 1,
     visita_xmes: [this.crearMesVisita()],
   };
   this.afs.collection("visitas_lugares").add(place);
 }
 /**
  * funcion Privada, se encarga de traer el registro de la tabla 'visitas_lugares' que
  * contega el valor que contenga la variable 'place_id'.
  * se asume que siempre va a existir un registro.
  * @param place_id : string
  */
 private getVisitasLugar(place_id: string) {
   this.afs
     .collection("visitas_lugares")
     .ref.where("id_place", "==", place_id)
     .get()
     .then((querySnapshot) => {
       const arrVisita: any[] = [];
       querySnapshot.forEach((item) => {
         const data: any = item.data();
         arrVisita.push({ id: item.id, ...data });
       });
       this.visita_lugar = arrVisita[0];
       this.sumarVisitaLugar(this.visita_lugar, place_id);
     })
     .catch((err) => {
       console.error(
         "Error en al traer la informacion de Place ::getVisitasLugar" + err
       );
     })
     .finally(() => console.log("Finally"));
 }
 /**
  * Funcion privada. Se encarga de actualizar los registros de Visitas a Lugares.
  * @param visitaLugar : tipo Interfaz VisitaPlace
  */
 private updateVisitaLugar(visitaLugar: VisitaPlace) {
   let total_visitas: number = visitaLugar.total_visitas;
   let visita_xmes: MesVisita[] = visitaLugar.visita_xmes;
   this.afs
     .doc(`visitas_lugares/${visitaLugar.id}`)
     .update({
       total_visitas,
       visita_xmes,
     })
     .then((a) => {
       console.info("Success al ::ACTUALIZAR:: el registro " + a);
     })
     .catch((err) => {
       console.error("Error al ::ACTUALIZAR:: la visita " + err);
     });
 }
 /**
  * Se encarga de actulizar el registro de la visita al lugar si este existe, o de
  * crear uno nuevo.
  * @param visitaLugar
  * @param place_id
  */
 private sumarVisitaLugar(visitaLugar: VisitaPlace, place_id?: string) {
   if (typeof visitaLugar != "undefined") {
     this.sumarVisitaXMes(visitaLugar.visita_xmes);
     this.incrementarTotalVisitasLugar(visitaLugar);
     this.updateVisitaLugar(visitaLugar);
   } else {
     this.createVisitaLugar(place_id);
   }
 }

 private sumarVisitaXMes(visita_xmes: MesVisita[]): MesVisita[] {
   let cant_meses = visita_xmes.length;
   if (this.esteMesTieneVisita(visita_xmes[cant_meses - 1])) {
     this.sumarVisitaXDia(visita_xmes[cant_meses - 1].visita_xdia);
     this.incrementarTotalVisitasXMes(visita_xmes[cant_meses - 1]);
   } else {
     this.agregarMesVisita(visita_xmes);
   }
   return visita_xmes;
 }
 /**
  * Se encarga de actulizar la visita realizada en dia para ese luegar, o de
  * crear una visita para ese dia.
  * @param visita_xdia
  * @returns
  */
 private sumarVisitaXDia(visita_xdia: DiaVisita[]): DiaVisita[] {
   let cant_dia = visita_xdia.length;
   if (this.ves.hoyTieneVisita(visita_xdia[cant_dia - 1])) {
     this.ves.incrementarVisitaXDia(visita_xdia[cant_dia - 1]);
   } else {
     this.ves.agregarDiaVisita(visita_xdia);
   }
   return visita_xdia;
 }
 /**
  * Revisa si el Place tiene visitas este mes.
  * @param mesVisita
  * @returns
  */
 private esteMesTieneVisita(mesVisita: MesVisita): boolean {
   let mesActual = new Date().toLocaleString("default", { month: "long" });
   if (mesActual === mesVisita.mes) return true;
   else return false;
 }

 private agregarMesVisita(visita_xmes: MesVisita[]): MesVisita[] {
   visita_xmes.push(this.crearMesVisita());
   return visita_xmes;
 }
 /**
  * Incrementa el contador (+1) de visitas por mes, actualizando el total de visitas
  * realizadas en ese mes.
  * @param mesVisita
  * @returns
  */
 private incrementarTotalVisitasXMes(mesVisita: MesVisita): MesVisita {
   mesVisita.cant_vta_xmes++;
   return mesVisita;
 }
 /**
  * Incrementa el contador (+1) de visitas, actualizando el total de visitas
  * realizadas al Lugar.
  * @param visitaLugar
  * @returns
  */
 private incrementarTotalVisitasLugar(visitaLugar: VisitaPlace): VisitaPlace {
   visitaLugar.total_visitas++;
   return visitaLugar;
 }

}
