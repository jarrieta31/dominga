import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { DondeComer } from "src/app/shared/donde-comer";
import { GeolocationService } from "../geolocation.service";

@Injectable({
  providedIn: "root",
})
export class WhereEatService {
  donde_comer: BehaviorSubject<DondeComer[]>;
  init_dondecomer: DondeComer[] = [];
  save_depto: String[] = [];
  depto: String = null;
  distance: number = null;
  allDondeComer: DondeComer[] = [];

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

  /**se guardan los lugares recibidos desde el filtro distancia */
  distanceEat: DondeComer[] = [];

  constructor(private afs: AngularFirestore, private geolocationSvc: GeolocationService) {
    this.donde_comer = new BehaviorSubject<DondeComer[]>(this.init_dondecomer);
  }

  getDondeComer() {
    let checkDepto = this.geolocationSvc.currentDepto;
    this.depto = localStorage.getItem("deptoActivo");
    this.distance = parseInt(localStorage.getItem("distanceActivo"));
    this.allDondeComer = [];
    this.distanceEat = [];

    let searchDepto: boolean = false;
    this.save_depto.forEach((search) => {
      if (search == this.depto) {
        searchDepto = true;
      }
    });

    if (this.depto != null && !searchDepto) {
      this.afs
        .collection("donde_comer")
        .ref.where("departamento", "==", this.depto)
        .where("publicado", "==", true)
        .orderBy("nombre")
        .get()
        .then((querySnapshot) => {
          const arrDondeComer: DondeComer[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrDondeComer.push({ id: item.id, ...data });
            this.init_dondecomer.push({ id: item.id, ...data });
          });

          this.allDondeComer = arrDondeComer;
          this.donde_comer.next(this.allDondeComer);
          this.save_depto.push(this.depto);
          searchDepto = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    } else if (searchDepto) {
      this.init_dondecomer.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allDondeComer.push(res);
        }
      });
      this.donde_comer.next(this.allDondeComer);
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
          this.init_dondecomer.forEach((init: any) => {
            if (init.departamento == dep) this.distanceEat.push(init);
          });
          deptoSearch = false;
        } else {
          this.afs
          .collection("donde_comer")
          .ref.where("departamento", "==", dep)
          .where("publicado", "==", true)
          .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((item) => {
                const data: any = item.data();
                this.init_dondecomer.push({ id: item.id, ...data });
                this.distanceEat.push({ id: item.id, ...data });
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
      this.donde_comer.next(this.distanceEat);
    }
  }
}
