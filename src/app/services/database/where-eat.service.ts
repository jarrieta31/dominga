import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DondeComer } from 'src/app/shared/donde-comer';
import { DatabaseService } from '../database.service';



@Injectable({
  providedIn: 'root'
})
export class WhereEatService {  

  donde_comer: BehaviorSubject<DondeComer[]>;
  init_dondecomer: DondeComer[] = [];
  save_depto : String[] = [];
  depto: String; 
  allDondeComer : DondeComer[] = [];
  
    
  constructor(
    private afs : AngularFirestore,
    private db : DatabaseService,
  ) { 
    this.getDondeComer();
    
  }

  // getDondeComer() {
  //   this.donde_comer = new BehaviorSubject<DondeComer[]>(this.init_dondecomer)

  //   this.afs
  //     .collection("donde_comer")
  //     .ref.where("departamento", "==", this.db.selectionDepto)
  //     .get()
  //     .then((querySanpshot) => {
  //       const arryDondeComer: DondeComer[] = [];
  //       querySanpshot.forEach((item) => {
  //         const data: any = item.data();
  //         arryDondeComer.push({ id: item.id, ...data });
  //         this.init_dondecomer.push({ id: item.id, ...data });
  //       });
  //       this.donde_comer.next(this.init_dondecomer);
  //     })
  //     .finally(() => console.log("Finally"));
  // }



  getDondeComer(){
    this.depto = this.db.selectionDepto;
    this.donde_comer = new BehaviorSubject<DondeComer[]>(this.init_dondecomer);

    let searchDepto: boolean = false;
    this.save_depto.forEach((search) => {
      if (search == this.depto) {
        searchDepto = true;
      }
    });
      console.log(this.depto);
      
    if (this.depto != null && !searchDepto) {
      this.afs
        .collection("donde_comer")
        .ref.where("departamento", "==", this.depto)
        .where("publicado", "==", true)
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
      this.allDondeComer = [];
      this.init_dondecomer.forEach((res) => {
        if (res.departamento == this.depto) {
          this.allDondeComer.push(res);
        }
      });
      this.donde_comer.next(this.allDondeComer);
    }
  }


}
