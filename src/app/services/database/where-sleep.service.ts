import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { DondeDormir } from "src/app/shared/donde-dormir";
import { DatabaseService } from "../database.service";

@Injectable({
  providedIn: "root",
})
export class WhereSleepService {
  /**Se guardan los lugares del departamento seleccionado */
  donde_dormir: BehaviorSubject<DondeDormir[]>;
  /**Nombre del departamento seleccionado actualmente*/
  depto: String = "";
  /**Guarda todos los lugares del departamento seleccionado actualmente*/
  allLugares: DondeDormir[] = [];
  /**Se van acumulando todos los lugares de los departamentos seleccionados */
  init_dondedormir: DondeDormir[] = [];
  /** Guarda el nombre de los departamentos que ya fueron seleccionados por el usuario*/
  save_depto: String[] = [];

  constructor(
    private afs: AngularFirestore,
    private databaseSvc: DatabaseService
  ) {}

  getDondeDormir() {
    this.depto = this.databaseSvc.selectionDepto;
    this.donde_dormir = new BehaviorSubject<DondeDormir[]>(
      this.init_dondedormir
    );

    let searchDepto: boolean = false;
    this.save_depto.forEach((search) => {
      if (search == this.depto) {
        searchDepto = true;
      }
    });

    if (this.depto != null && !searchDepto) {
      this.afs
        .collection("donde_dormir")
        .ref.where("departamento", "==", this.depto)
        .where("publicado", "==", true)
        .get()
        .then((querySnapshot) => {
          const arrPlaces: DondeDormir[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrPlaces.push({ id: item.id, ...data });
            this.init_dondedormir.push({ id: item.id, ...data });
          });
          this.allLugares = arrPlaces;
          this.donde_dormir.next(this.allLugares);
          this.save_depto.push(this.depto);
          searchDepto = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    } else if (searchDepto) {
      this.allLugares = [];
      this.init_dondedormir.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allLugares.push(res);
        }
      });
      this.donde_dormir.next(this.allLugares);
    }
  }
}
