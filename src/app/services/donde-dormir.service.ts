import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class DondeDormirService {

  donde_dormir: any[] = [];

  constructor( private afs : AngularFirestore ) { 
    this.getDondeDormir();
  }
  
  getDondeDormir() {
    this.afs
      .collection("donde_dormir")
      .ref.where("departamento", "==", "San Jose")
      .get()
      .then((querySanpshot) => {
        const arryDondeDormir: any[] = [];
        querySanpshot.forEach((item) => {
          const data: any = item.data();
          arryDondeDormir.push({ id: item.id, ...data });
        });
        this.donde_dormir = arryDondeDormir;
      })
      .finally(() => console.log("Finally"));
  }

}
