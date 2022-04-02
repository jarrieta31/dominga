import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { Eventos } from "../shared/eventos";
import { Departament } from "../shared/departament";
import { Subscription } from "rxjs";
import distance from "@turf/distance";
import { GeolocationService } from "./geolocation.service";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  today: Date = new Date();
  /**Se van acumulando todos los lugares de los departamentos seleccionados */
  initEvents: Eventos[] = [];
  /** Guarda el nombre de los departamentos que ya fueron seleccionados por el usuario*/
  save_depto: string[] = [];
  /** guarda los datos para pantalla de casa domninga */
  dominga: any[] = [];
  casaDominga: BehaviorSubject<any[]>;

  // Iniciamos el servicio 'AngularFireDatabase' de Angular Fire
  constructor(
    private afs: AngularFirestore,
    private geolocationSvc: GeolocationService
  ) {
    this.eventos = new BehaviorSubject<Eventos[]>(this.distanceEvents);
    this.casaDominga = new BehaviorSubject<Eventos[]>(this.dominga);
  }

  eventos: BehaviorSubject<Eventos[]>;
  allEvents: Eventos[] = [];

  currentPosition$: Subscription;
  position$: Observable<any>;

  selectionDepto: string | null = null;
  selectionDistance: number | null = null;

  /**Nombre del departamento seleccionado actualmente*/
  depto: string = null;
  /**Distancia seleccionada actualmente */
  distance: number = null;

  /**se guardan los lugares recibidos desde el filtro distancia */
  distanceEvents: Eventos[] = [];

  /**controla si la base devuelve datos */
  noData: boolean = false;
  /**controla que existen lugares en el rango de distancia */
  controlDistance: boolean = false;

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
  getSelectMenu(depto: string | null, distance: number | null) {
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
    // console.log(this.initEvents);
    this.depto = localStorage.getItem("deptoActivo");
    this.distance = parseInt(localStorage.getItem("distanceActivo"));
    this.allEvents = [];
    this.distanceEvents = [];

    this.controlDistance = false;

    let searchDepto: boolean = false;

    const options = { units: "kilometers" };

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
        .where("fechaFin", ">=", this.today)
        .where("publicado", "==", true)
        .orderBy("fechaInicio", "asc")
        .get()
        .then((querySnapshot) => {
          const mapEvents = new Map();
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            data.fechaInicio = new Date(data.fechaInicio["seconds"] * 1000);
            data.fechaFin = new Date(data.fechaFin["seconds"] * 1000);

            let evento = { id: item.id, ...data };
            mapEvents.set(evento.id, { ...data });

            let test = this.initEvents.find(function (element) {
              return element.id === evento.id;
            });

            if (test === undefined) {
              this.initEvents.push(evento);
            }
          });

          this.allEvents = [...mapEvents.values()];

          if (
            this.geolocationSvc.posicion !== undefined &&
            this.geolocationSvc.posicion !== null
          ) {
            this.allEvents.forEach((dist) => {
              let calcDist = distance(
                [
                  this.geolocationSvc.posicion.longitud,
                  this.geolocationSvc.posicion.latitud,
                ],
                [dist.ubicacion.lng, dist.ubicacion.lat],
                options
              );
              dist.distancia = calcDist;
              dist.distanciaNumber = calcDist;
            });
          }

          if (querySnapshot.size !== 0) {
            this.save_depto.push(this.depto);
            this.noData = false;
          } else this.noData = true;

          searchDepto = false;

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

      if (
        this.geolocationSvc.posicion !== undefined &&
        this.geolocationSvc.posicion !== null
      ) {
        this.allEvents.forEach((dist) => {
          let calcDist = distance(
            [
              this.geolocationSvc.posicion.longitud,
              this.geolocationSvc.posicion.latitud,
            ],
            [dist.ubicacion.lng, dist.ubicacion.lat],
            options
          );
          dist.distancia = calcDist;
          dist.distanciaNumber = calcDist;
        });
      }

      this.allEvents.length !== 0 ? (this.noData = false) : this.noData;

      this.eventos.next(this.allEvents);
    } else if (this.distance != null) {
      let deptoSearch: boolean = false;
      let limitCurrent: string[] = [];

      this.deptoLimit.forEach((res) => {
        if (res.nameDepto == checkDepto) {
          res.limit.forEach((dep: string) => {
            limitCurrent.push(dep);
          });
        }
      });

      limitCurrent.forEach((dep: string) => {
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

          if (
            this.geolocationSvc.posicion !== undefined &&
            this.geolocationSvc.posicion !== null
          ) {
            this.distanceEvents.forEach((dist) => {
              let calcDist = distance(
                [
                  this.geolocationSvc.posicion.longitud,
                  this.geolocationSvc.posicion.latitud,
                ],
                [dist.ubicacion.lng, dist.ubicacion.lat],
                options
              );
              dist.distancia = calcDist;
              dist.distanciaNumber = calcDist;

              if (calcDist <= this.distance) {
                this.controlDistance = true;
              }
            });
          }

          deptoSearch = false;
        } else {
          this.afs
            .collection("eventos")
            .ref.where("departamento", "==", dep)
            .where("fechaFin", ">=", this.today)
            .where("publicado", "==", true)
            .orderBy("fechaInicio", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((item) => {
                const data: any = item.data();
                data.fechaInicio = new Date(data.fechaInicio["seconds"] * 1000);
                data.fechaFin = new Date(data.fechaFin["seconds"] * 1000);

                let evento = { id: item.id, ...data };

                let test = this.initEvents.find(function (element) {
                  return element.id === evento.id;
                });

                if (test === undefined) {
                  this.initEvents.push(evento);
                  this.distanceEvents.push(evento);
                }
              });

              if (
                this.geolocationSvc.posicion !== undefined &&
                this.geolocationSvc.posicion !== null
              ) {
                this.distanceEvents.forEach((dist) => {
                  let calcDist = distance(
                    [
                      this.geolocationSvc.posicion.longitud,
                      this.geolocationSvc.posicion.latitud,
                    ],
                    [dist.ubicacion.lng, dist.ubicacion.lat],
                    options
                  );
                  dist.distancia = calcDist;
                  dist.distanciaNumber = calcDist;

                  if (calcDist <= this.distance) {
                    this.controlDistance = true;
                  }
                });
              }

              if (!searchDepto && querySnapshot.size !== 0)
                this.save_depto.push(dep);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => "Fin");
          deptoSearch = false;
        }
      });
      this.distanceEvents.length !== 0 ? (this.noData = false) : this.noData;

      this.distanceEvents.sort((a, b) => {
        if (a.fechaInicio < b.fechaInicio) {
          return -1;
        }

        if (a.fechaInicio > b.fechaInicio) {
          return 1;
        }

        return 0;
      });

      this.eventos.next(this.distanceEvents);
    }

    return this.eventos;
  }

  allDepartament: Departament[] = [];
  departamentosActivos: BehaviorSubject<Departament[]>;
  deptoFound: boolean = false;
  /**
   * Obtener departamentos activos
   */
  getDepartamentosActivos() {
    this.departamentosActivos = new BehaviorSubject<Departament[]>(
      this.allDepartament
    );

    if (this.deptoFound === false) {
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
          this.allDepartament = JSON.parse(JSON.stringify(arrDeptos));
          this.departamentosActivos.next(this.allDepartament);

          this.deptoFound = true;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Finally");
    } else {
      this.departamentosActivos.next(this.allDepartament);
    }
  }

  getDominga() {
    this.dominga = [];

    this.afs
      .collection("dominga")
      .ref.get()
      .then((querySnapshot) => {
        const arrDominga: any[] = [];
        querySnapshot.forEach((item) => {
          const data: any = item.data();
          arrDominga.push({ id: item.id, ...data });
        });
        this.dominga = JSON.parse(JSON.stringify(arrDominga));
        this.casaDominga.next(this.dominga);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => "Finally");

    return this.casaDominga;
  }
}
