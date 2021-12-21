import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Place } from "src/app/shared/place";
import { DatabaseService } from "../database.service";

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
          //console.log(this.initPlace);
          this.allLugares = arrPlaces;
          this.places.next(this.allLugares);
          //console.log(this.allLugares);
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
}
