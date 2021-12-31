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
  depto: String = "";
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

  constructor(
    private databaseSvc: DatabaseService,
    private afs: AngularFirestore
  ) {}

  /**
   * Devuelve los lugares del departamento seleccionado por el usuario
   * @param searchDepto se utiliza para chequear si el departamento ya fue seleccionado anteriormente
   */
  getPlaces() {
    this.depto = this.databaseSvc.selectionDepto;
    this.places = new BehaviorSubject<Place[]>(this.initPlace);

    let searchDepto: boolean = false;
    this.save_depto.forEach((search) => {
      if (search == this.depto) {
        searchDepto = true;
      }
    });

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
    } else if (searchDepto) {
      this.allLugares = [];
      this.initPlace.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allLugares.push(res);
        }
      });
      this.places.next(this.allLugares);
    }
  }

  /**Devuelve un lugar específico
   * @param id del lugar a buscar
   */
  getPlaceId(id: string) {
    this.place_selected = new BehaviorSubject<Place>(null);
    this.near_place = null;

    this.initPlace.forEach((res) => {
      if (res.id == id) {
        res.descripcion = res.descripcion.substring(0, 140) + " ...";
        res.descripcion = res.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
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
      if (res.id != this.near_place.id) {
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
