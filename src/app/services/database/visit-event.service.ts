import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TipoDiaVisita as DiaVisita } from 'src/app/shared/tipo-dia-visita';
import { TipoVisitaEvento as VisitaEvento } from 'src/app/shared/tipo-visita-evento';

@Injectable({
  providedIn: 'root'
})
export class VisitEventService {

  visita_evento   :  VisitaEvento;
  visitasAEventos : string[] = [];


  constructor(
    private afs : AngularFirestore
  ) { }

    // >>>>>>>>>>>>>  :: CONTADOR VISITAS A EVENTOS :: <<<<<<<<<<<<<<<<<<<
    /**
   * funcion publica. recibe los datos del controlador.
   * Guarda le parametro recibido en un array global "visitas : string[]".
   * Revisa que no se repita le parametro recibido.
   * Pasa el parametro a la funcion getVisita(id: string)
   * @param id : string.
   * Recibe el id de un Evento.
   */
     contadorVisitasEvento(id: string) {
      let control: boolean = false;
      if (this.visitasAEventos.length == 0) {
        this.visitasAEventos.push(id);
        this.getVisita(id);
      } else {
        this.visitasAEventos.forEach((v) => {
          if (v === id) {
            control = !control;
          }
        });
        if (!control) {
          this.visitasAEventos.push(id);
          this.getVisita(id);
        }
      }
    }
  
 /**
   * Se encarga de actulizar la visita realizada en dia para ese luegar, o de
   * crear una visita para ese dia.
   * @param visita_xdia
   * @returns
   */
  sumarVisitaXDia(visita_xdia: DiaVisita[]): DiaVisita[] {
    let cant_dia = visita_xdia.length;
    if (this.hoyTieneVisita(visita_xdia[cant_dia - 1])) {
      this.incrementarVisitaXDia(visita_xdia[cant_dia - 1]);
    } else {
      this.agregarDiaVisita(visita_xdia);
    }
    return visita_xdia;
  }    
    /**
     * Recibe los parametros de getVisita( evento_id : string )
     * Se encarga de revisar el parametro visita recibido, luego llama a los
     * metodos para incrementar o crear la visita.
     * @param visita : interfaz Visita.
     * @param evento_id : string
     */
    sumarVisitaEvento(visita: VisitaEvento, evento_id?: string) {
      if (typeof visita != "undefined") {
        let cantDiasVisita = visita.visita_xdia.length;
        this.sumarVisitaXDia(visita.visita_xdia);
        this.incrementarTotalVisitaXEvento(visita);
        this.actulizarVisita(visita);
      } else {
        this.crearVisita(evento_id);
        console.log(`entrando a crear visita para el evento`);
      }
    }
    /**
     * Funcion privada. Crea una objeto de Visita, y luego lo inserta en la BD.
     * @param evento_id : string
     */
    crearVisita(evento_id: string) {
      let visita: VisitaEvento = {
        id_evento: evento_id,
        total_visitas: 1,
        visita_xdia: [
          {
            dia: this.getToday(),
            cant_vta_xdia: 1,
          },
        ],
      };
      this.afs.collection("visitas_evento").add(visita);
    }
  
    /**
     * Esta funcion se encarga de traer una visita asociada a un evento y
     * setear la variable global visita: Vista.
     * En el caso de que no exista una visita para ese evento, setea la
     * variable global en null.
     * @param evento_id
     * Es de tipo string.
     */
    getVisita(evento_id: string) {
      this.afs
        .collection("visitas_evento")
        .ref.where("id_evento", "==", evento_id)
        .get()
        .then((querySnapshot) => {
          const arrVisita: any[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrVisita.push({ id: item.id, ...data });
          });
          this.visita_evento = arrVisita[0];
          this.sumarVisitaEvento(this.visita_evento, evento_id);
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
    private actulizarVisita(visita: VisitaEvento) {
      let total_visitas: number = visita.total_visitas;
      let visita_xdia: DiaVisita[] = visita.visita_xdia;
  
      this.afs
        .doc(`visitas_evento/${visita.id}`)
        .update({
          total_visitas,
          visita_xdia,
        })
        .then()
        .catch((err) => {
          console.error("Error en al traer la visita" + err);
        });
    }

  /**
   * funcion privada. Se encarga de crear una instancia de tipo Date con
   * la fecha actual.
   * @returns Date
   */
  getToday(): Date {
    let aux: Date = new Date();
    let dd = aux.getDate();
    let mm = aux.getMonth();
    let aa = aux.getFullYear();
    return new Date(aa, mm, dd);
  }


  /**
   * funcion privada. Se encarga de comparar si la fecha de la ultima visita realizada
   * es igual a la fecha actual.
   * @param ultimaVisita : interfaz DiaVisita
   * @returns boolean
   */
  hoyTieneVisita(ultimaVisita: DiaVisita): boolean {
    let diaVisita = new Date(ultimaVisita.dia["seconds"] * 1000);
    let hoy = this.getToday();

    if (+hoy === +diaVisita) return true;
    else return false;
  }

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
      dia: this.getToday(),
    };
    return visita;
  }
  
  /**
   * funcion privada. Agrega al arreglo un nuevo dia de visita para el evento asociado,
   * retornando un array de DiaVisita.
   * @param visitas : array de interfaz DiaVisita[]
   * @returns array de interfaz DiaVisita[]
   */
  agregarDiaVisita(visitas: DiaVisita[]): DiaVisita[] {
    visitas.push(this.crearDiaVisita());
    return visitas;
  }
  /**
   * funcion privada. Se encarga de +1 a la variable cant_vta_xdia
   * @param ultimaVisita : interfaz DiaVisita
   * @returns interfaz DiaVisita
   */
  incrementarVisitaXDia(ultimaVisita: DiaVisita): DiaVisita {
    ultimaVisita.cant_vta_xdia++;
    return ultimaVisita;
  }
  /**
   * funcion privada. Se encarga de +1 a la variable total_visitas
   * @param visitas : interfaz Visita
   * @returns interfaz Visita
   */
  private incrementarTotalVisitaXEvento(visitas: VisitaEvento): VisitaEvento {
    visitas.total_visitas++;
    return visitas;
  }


}
