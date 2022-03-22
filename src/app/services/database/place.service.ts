import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Place } from "src/app/shared/place";
import distance from "@turf/distance";
import { Point } from "src/app/shared/point";
import { GeolocationService } from "../geolocation.service";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  /**Se guardan los lugares del departamento seleccionado */
  places: BehaviorSubject<Place[]>;
  /**Nombre del departamento seleccionado actualmente*/
  depto: string = null;
  /**Distancia seleccionada actualmente */
  distance: number = null;
  /**Departamento actual para usar cuando se selecciona filtro por distancia */
  currentDpto: string = null;
  /**Guarda todos los lugares del departamento seleccionado actualmente*/
  allLugares: Place[] = [];
  /**Se van acumulando todos los lugares de los departamentos seleccionados */
  initPlace: Place[] = [];
  /** Guarda el nombre de los departamentos que ya fueron seleccionados por el usuario*/
  save_depto: string[] = [];
  /**Lugar seleccionado*/
  place_selected: BehaviorSubject<Place>;
  /**Lugar seleccionado para utilizar en búsuqeda de lugares cercanos */
  near_place: Place;
  /**Se guardan todos los lugares con la distancia desde el lugar seleccionado */
  distance_place: any[] = [];
  /**Guarda los 4 lugares más cercanos al seleccionado */
  near_places: BehaviorSubject<any[]>;
  /**guarda la posición actual del usuario */
  posicion$: Observable<Point>;
  /**se guardan los lugares recibidos desde el filtro distancia */
  distancePlaces: Place[] = [];
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

  constructor(
    private afs: AngularFirestore,
    private geolocationSvc: GeolocationService
  ) {
    this.places = new BehaviorSubject<Place[]>(this.initPlace);
  }

  /**
   * Devuelve los lugares del departamento seleccionado por el usuario
   * @param searchDepto se utiliza para chequear si el departamento ya fue seleccionado anteriormente
   */
  getPlaces(checkDepto: string) {
    this.depto = localStorage.getItem("deptoActivo");
    this.distance = parseInt(localStorage.getItem("distanceActivo"));
    this.allLugares = [];
    this.distancePlaces = [];

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
        .collection("lugares")
        .ref.where("departamento", "==", this.depto)
        .where("publicado", "==", true)
        .orderBy("prioridad")
        .get()
        .then((querySnapshot) => {
          const arrPlaces: Place[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrPlaces.push({ id: item.id, ...data });
            this.initPlace.push({ id: item.id, ...data });
          });
          this.allLugares = arrPlaces;

          if (
            this.geolocationSvc.posicion !== undefined &&
            this.geolocationSvc.posicion !== null
          ) {
            this.allLugares.forEach((dist) => {
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
          } else if (
            this.geolocationSvc.posicion === undefined ||
            this.geolocationSvc.posicion === null
          ) {
            this.allLugares.forEach((dist) => {
              dist.distancia = "Ubicación no activa";
              dist.distanciaNumber = "Ubicación no activa";
            });
          }

          if (querySnapshot.size !== 0) {
            this.save_depto.push(this.depto);
            this.noData = false;
          } else this.noData = true;

          this.places.next(this.allLugares);

          searchDepto = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    } else if (this.depto != null && searchDepto) {
      this.initPlace.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allLugares.push(res);
        }
      });

      if (
        this.geolocationSvc.posicion !== undefined &&
        this.geolocationSvc.posicion !== null
      ) {
        this.allLugares.forEach((dist) => {
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

      this.allLugares.length !== 0 ? (this.noData = false) : this.noData;

      this.places.next(this.allLugares);
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
          this.initPlace.forEach((init: any) => {
            if (init.departamento == dep) this.distancePlaces.push(init);
          });

          if (
            this.geolocationSvc.posicion !== undefined &&
            this.geolocationSvc.posicion !== null
          ) {
            this.distancePlaces.forEach((dist) => {
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
            .collection("lugares")
            .ref.where("departamento", "==", dep)
            .where("publicado", "==", true)
            .orderBy("prioridad")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((item) => {
                const data: any = item.data();
                this.initPlace.push({ id: item.id, ...data });
                this.distancePlaces.push({ id: item.id, ...data });
              });

              if (
                this.geolocationSvc.posicion !== undefined &&
                this.geolocationSvc.posicion !== null
              ) {
                this.distancePlaces.forEach((dist) => {
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
      this.distancePlaces.length !== 0 ? (this.noData = false) : this.noData;

      this.places.next(this.distancePlaces);
    }

    return this.places;
  }

  /**Devuelve un lugar específico
   * @param id del lugar a buscar
   */
  getPlaceId(id: string) {
    this.place_selected = new BehaviorSubject<Place>(null);
    this.near_place = null;

    this.initPlace.forEach((res) => {
      if (res.id == id) {
        res.descripcionCorta =
          res.descripcion.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 140) +
          "..." +
          `<a>Ver más</a>`;
        this.near_place = res;
        this.place_selected.next(res);
      }
    });
  }

  /**Busca los 4 lugares más cercanos al lugar seleccionado*/
  getPlaceNear() {
    this.near_places = new BehaviorSubject<any[]>(null);
    this.distance_place = [];
    let options = { units: "kilometers" };

    this.initPlace.forEach((res) => {
      if (res.id != this.near_place.id && res.departamento == this.depto) {
        let dist = distance(
          [this.near_place.ubicacion.lng, this.near_place.ubicacion.lat],
          [res.ubicacion.lng, res.ubicacion.lat],
          options
        );

        this.distance_place.push({
          id: res.id,
          name: res.nombre,
          image: res.imagenPrincipal,
          distance: dist,
        });
      } else if (res.id != this.near_place.id && this.distance !== null) {
        let dist = distance(
          [this.near_place.ubicacion.lng, this.near_place.ubicacion.lat],
          [res.ubicacion.lng, res.ubicacion.lat],
          options
        );

        this.distance_place.push({
          id: res.id,
          name: res.nombre,
          image: res.imagenPrincipal,
          distance: dist,
        });
      }
    });

    this.distance_place.sort((a, b) =>
      a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
    );

    while (this.distance_place.length > 4) {
      this.distance_place.pop();
    }

    this.near_places.next(this.distance_place);
  }
}
