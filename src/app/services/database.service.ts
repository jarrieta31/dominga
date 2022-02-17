import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Eventos } from "../shared/eventos";
import { Departament } from "../shared/departament";
import { Subscription } from "rxjs";
import { GeolocationService } from "./geolocation.service";

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
      .ref.where("departamento", "==", this.selectionDepto)
      .where("fechaInicio", ">=", this.today)
      .where("publicado", "==", true)
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
    this.departamentosActivos = new BehaviorSubject<Departament[]>(
      this.allDepartament
    );

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

  limpiarTexto(text: string): string {
    let _txt: string;
    let txt: string;
    _txt = text.replace(/<[^>]*>?/g, "");

    return _txt;
  }
}
