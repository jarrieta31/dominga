import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DondeComer } from 'src/app/shared/donde-comer';



@Injectable({
  providedIn: 'root'
})
export class WhereEatService {  

  donde_comer: BehaviorSubject<DondeComer[]>;
  init_dondecomer: DondeComer[] = [];
    
  constructor(
    private afs : AngularFirestore,
  ) { 
    this.getDondeComer();
  }

  getDondeComer() {
    this.donde_comer = new BehaviorSubject<DondeComer[]>(this.init_dondecomer)

    this.afs
      .collection("donde_comer")
      .ref.where("departamento", "==", "San Jose")
      .get()
      .then((querySanpshot) => {
        const arryDondeComer: DondeComer[] = [];
        querySanpshot.forEach((item) => {
          const data: any = item.data();
          arryDondeComer.push({ id: item.id, ...data });
          this.init_dondecomer.push({ id: item.id, ...data });
        });
        this.donde_comer.next(this.init_dondecomer);
      })
      .finally(() => console.log("Finally"));
  }

}
