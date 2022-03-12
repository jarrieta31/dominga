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
  today: Date = new Date();

  /**Guarda todos los lugares del departamento seleccionado actualmente*/
  allLugares: Eventos[] = [];
  /**Se van acumulando todos los lugares de los departamentos seleccionados */
  initEvents: Eventos[] = [];
  /** Guarda el nombre de los departamentos que ya fueron seleccionados por el usuario*/
  save_depto: String[] = [];

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(
    private afs: AngularFirestore,
    private geoService: GeolocationService
  ) {
    this.eventos = new BehaviorSubject<Eventos[]>(this.distanceEvents);
  }

  eventos: BehaviorSubject<Eventos[]>;
  allEvents: Eventos[] = [];

  currentPosition$: Subscription;
  position$: Observable<any>;

  selectionDepto: String | null = null;
  selectionDistance: number | null = null;

  /**Nombre del departamento seleccionado actualmente*/
  depto: String = null;
  /**Distancia seleccionada actualmente */
  distance: number = null;

  /**se guardan los lugares recibidos desde el filtro distancia */
  distanceEvents: Eventos[] = [];

  deptoLimit: any[] = [
    { nameDepto: "Artigas", limit: ["Artigas", "Salto", "Rivera"] },
    {
      nameDepto: "Canelones",
      limit: ["Canelones", "Florida", "Lavalleja", "Maldonado", "San José"],
    },
    {
      nameDepto: "Cerro Largo",
      limit: [
        "Cerro Largo",
        "Durazno",
        "Rivera",
        "Tacuarembó",
        "Treinta y Tres",
      ],
    },
    {
      nameDepto: "Colonia",
      limit: ["Colonia", "Flores", "San José", "Soriano"],
    },
    {
      nameDepto: "Durazno",
      limit: [
        "Durazno",
        "Cerro Largo",
        "Flores",
        "Florida",
        "Río Negro",
        "Soriano",
        "Tacuarembó",
        "Treinta y Tres",
      ],
    },
    {
      nameDepto: "Flores",
      limit: [
        "Flores",
        "Colonia",
        "Durazno",
        "Florida",
        "Río Negro",
        "San José",
        "Soriano",
      ],
    },
    {
      nameDepto: "Florida",
      limit: [
        "Florida",
        "Canelones",
        "Durazno",
        "Flores",
        "Lavalleja",
        "San José",
        "Treinta y Tres",
      ],
    },
    {
      nameDepto: "Lavalleja",
      limit: [
        "Lavalleja",
        "Canelones",
        "Florida",
        "Maldonado",
        "Rocha",
        "Treinta y Tres",
      ],
    },
    {
      nameDepto: "Maldonado",
      limit: ["Maldonado", "Canelones", "Lavalleja", "Rocha"],
    },
    { nameDepto: "Montevideo", limit: ["Montevideo", "Canelones", "San José"] },
    {
      nameDepto: "Paysandú",
      limit: ["Paysandú", "Río Negro", "Salto", "Tacuarembó"],
    },
    {
      nameDepto: "Río Negro",
      limit: [
        "Río Negro",
        "Durazno",
        "Flores",
        "Paysandú",
        "Soriano",
        "Tacuarembó",
      ],
    },
    {
      nameDepto: "Rivera",
      limit: ["Rivera", "Artigas", "Cerro Largo", "Salto", "Tacuarembó"],
    },
    {
      nameDepto: "Rocha",
      limit: ["Rocha", "Maldonado", "Lavalleja", "Treinta y Tres"],
    },
    {
      nameDepto: "Salto",
      limit: ["Salto", "Artigas", "Paysandú", "Rivera", "Tacuarembó"],
    },
    {
      nameDepto: "San José",
      limit: [
        "San José",
        "Canelones",
        "Colonia",
        "Flores",
        "Florida",
        "Soriano",
      ],
    },
    {
      nameDepto: "Soriano",
      limit: [
        "Soriano",
        "Colonia",
        "Durazno",
        "Flores",
        "Río Negro",
        "San José",
      ],
    },
    {
      nameDepto: "Tacuarembó",
      limit: [
        "Tacuarembó",
        "Cerro Largo",
        "Durazno",
        "Paysandú",
        "Río Negro",
        "Rivera",
        "Salto",
      ],
    },
    {
      nameDepto: "Treinta y Tres",
      limit: [
        "Treinta y Tres",
        "Cerro Largo",
        "Durazno",
        "Florida",
        "Lavalleja",
        "Rocha",
        "Tacuarembó",
      ],
    },
  ];

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
  getEventos(checkDepto: string) {
    this.depto = localStorage.getItem("deptoActivo");
    this.distance = parseInt(localStorage.getItem("distanceActivo"));
    this.allEvents = [];
    this.distanceEvents = [];

    let searchDepto: boolean = false;

    if (this.depto != null) {
      this.save_depto.forEach((search) => {
        if (search == this.depto) {
          searchDepto = true;
        }
      });
    }

    if (this.depto != null && !searchDepto) {
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
            data.fechaInicio = new Date(data.fechaInicio["seconds"] * 1000);
            arrEvents.push({ id: item.id, ...data });
            this.initEvents.push({ id: item.id, ...data });
          });
          this.save_depto.push(this.depto);
          this.allEvents = arrEvents;
          this.eventos.next(this.allEvents);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Finally");
    } else if (this.depto != null && searchDepto) {
      this.initEvents.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allEvents.push(res);
        }
      });
      this.eventos.next(this.allEvents);
    } else if (this.distance != null) {
      let deptoSearch: boolean = false;
      let limitCurrent: String[] = [];

      this.deptoLimit.forEach((res) => {
        if (res.nameDepto == checkDepto) {
          res.limit.forEach((dep: String) => {
            limitCurrent.push(dep);
          });
        }
      });

      limitCurrent.forEach((dep: String) => {
        if (this.save_depto.length != 0) {
          this.save_depto.forEach((search) => {
            if (dep == search) {
              deptoSearch = true;
            }
          });
        }

        if (deptoSearch) {
          this.initEvents.forEach((init: any) => {
            if (init.departamento == dep) this.distanceEvents.push(init);
          });
          deptoSearch = false;
        } else {
          this.afs
            .collection("eventos")
            .ref.where("departamento", "==", dep)
            .where("fechaInicio", ">=", this.today)
            .where("publicado", "==", true)
            .orderBy("fechaInicio", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((item) => {
                const data: any = item.data();
                data.fechaInicio = new Date(data.fechaInicio["seconds"] * 1000);
                this.initEvents.push({ id: item.id, ...data });
                this.distanceEvents.push({ id: item.id, ...data });
              });
              if (!searchDepto) this.save_depto.push(dep);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => "Fin");
          deptoSearch = false;
        }
      });
      this.eventos.next(this.distanceEvents);
    }

    return this.eventos;
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
}
