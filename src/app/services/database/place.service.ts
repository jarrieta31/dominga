import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Place } from "src/app/shared/place";
import { DatabaseService } from "../database.service";
import distance from "@turf/distance";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  /**Se guardan los lugares del departamento seleccionado */
  places: BehaviorSubject<Place[]>;
  /**Nombre del departamento seleccionado actualmente*/
  depto: String = null;
  /**Distancia seleccionada actualmente */
  distance: number = null;
  /**Departamento actual para usar cuando se selecciona filtro por distancia */
  currentDpto: String = null;
  /**Guarda todos los lugares del departamento seleccionado actualmente*/
  allLugares: Place[] = [];
  /**Se van acumulando todos los lugares de los departamentos seleccionados */
  initPlace: Place[] = [];
  /** Guarda el nombre de los departamentos que ya fueron seleccionados por el usuario*/
  save_depto: String[] = [];
  /**Lugar seleccionado*/
  place_selected: BehaviorSubject<Place>;
  /**Lugar seleccionado para utilizar en búsuqeda de lugares cercanos */
  near_place: Place;
  /**Se guardan todos los lugares con la distancia desde el lugar seleccionado */
  distance_place: any[] = [];
  /**Guarda los 4 lugares más cercanos al seleccionado */
  near_places: BehaviorSubject<any[]>;

  deptoLimit: any = [
    { nameDepto: "Artigas", limit: ["Salto", "Rivera"] },
    {
      nameDepto: "Canelones",
      limit: ["Florida", "Lavalleja", "Maldonado", "San José"],
    },
    {
      nameDepto: "Cerro Largo",
      limit: ["Durazno", "Rivera", "Tacuarembó", "Treinta y Tres"],
    },
    { nameDepto: "Colonia", limit: ["Flores", "San José", "Soriano"] },
    {
      nameDepto: "Durazno",
      limit: [
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
      limit: ["Canelones", "Florida", "Maldonado", "Rocha", "Treinta y Tres"],
    },
    { nameDepto: "Maldonado", limit: ["Canelones", "Lavalleja", "Rocha"] },
    { nameDepto: "Paysandú", limit: ["Río Negro", "Salto", "Tacuarembó"] },
    {
      nameDepto: "Río Negro",
      limit: ["Durazno", "Flores", "Paysandú", "Soriano", "Tacuarembó"],
    },
    {
      nameDepto: "Rivera",
      limit: ["Artigas", "Cerro Largo", "Salto", "Tacuarembó"],
    },
    { nameDepto: "Rocha", limit: ["Maldonado", "Lavalleja", "Treinta y Tres"] },
    {
      nameDepto: "Salto",
      limit: ["Artigas", "Paysandú", "Rivera", "Tacuarembó"],
    },
    {
      nameDepto: "San José",
      limit: ["Canelones", "Colonia", "Flores", "Florida", "Soriano"],
    },
    {
      nameDepto: "Soriano",
      limit: ["Colonia", "Durazno", "Flores", "Río Negro", "San José"],
    },
    {
      nameDepto: "Tacuarembó",
      limit: [
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
    private databaseSvc: DatabaseService,
    private afs: AngularFirestore
  ) {
    this.places = new BehaviorSubject<Place[]>(this.initPlace);
  }

  /**
   * Devuelve los lugares del departamento seleccionado por el usuario
   * @param searchDepto se utiliza para chequear si el departamento ya fue seleccionado anteriormente
   */
  getPlaces() {
    //console.log(this.currentDpto);
    this.depto = this.databaseSvc.selectionDepto;
    this.distance = this.databaseSvc.selectionDistance;
    this.allLugares = [];

    this.places = new BehaviorSubject<Place[]>(this.initPlace);

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
          this.places.next(this.allLugares);
          this.save_depto.push(this.depto);
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
      this.places.next(this.allLugares);
    } else if (this.distance != null) {
    
      this.save_depto.forEach((dep) => {
        let deptoDistance: boolean = false;
        if (dep == this.depto) {
          deptoDistance = true;
        }

        if (!deptoDistance) {
          this.places.next(this.allLugares);
        } else if (deptoDistance) {
          this.places.next(this.allLugares);
        }
      });
    }
  }

  /**Devuelve un lugar específico
   * @param id del lugar a buscar
   */
  getPlaceId(id: String) {
    this.place_selected = new BehaviorSubject<Place>(null);
    this.near_place = null;

    this.initPlace.forEach((res) => {
      if (res.id == id) {
        res.descripcionCorta = res.descripcion.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 140) + "...";
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
