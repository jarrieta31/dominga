import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DondeDormir } from 'src/app/shared/donde-dormir';

@Injectable({
  providedIn: 'root'
})
export class WhereSleepService {

  donde_dormir: BehaviorSubject<DondeDormir[]>;
  init_dondedormir: DondeDormir[] = [];

  constructor( private afs : AngularFirestore ) { 
    this.getDondeDormir();
  }
  
  getDondeDormir() {
    this.donde_dormir = new BehaviorSubject<DondeDormir[]>(this.init_dondedormir)

    this.afs
      .collection("donde_dormir")
      .ref.where("departamento", "==", "San Jose")
      .get()
      .then((querySanpshot) => {
        const arryDondeDormir: DondeDormir[] = [];
        querySanpshot.forEach((item) => {
          const data: any = item.data();
          arryDondeDormir.push({ id: item.id, ...data });
          this.init_dondedormir.push({ id: item.id, ...data });
        });
        this.donde_dormir.next(this.init_dondedormir);
      })
      .finally(() => console.log("Finally"));
  }

}
