import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class WhereEatService {

  donde_comer: any[] = [];
    
  constructor(
    private afs : AngularFirestore,
  ) { 
    this.getDondeComer();

  }

  getDondeComer() {
    this.afs
      .collection("donde_comer")
      .ref.where("departamento", "==", "san jose")
      .get()
      .then((querySanpshot) => {
        const arryDondeComer: any[] = [];
        querySanpshot.forEach((item) => {
          const data: any = item.data();
          arryDondeComer.push({ id: item.id, ...data });
        });
        this.donde_comer = arryDondeComer;
      })
      .finally(() => console.log("Finally"));
  }


}
