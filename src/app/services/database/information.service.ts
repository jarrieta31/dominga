import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  info: BehaviorSubject<any[]>;
  information: any[] = [];

  allInfo: any[] = [];
  init_info: any[] = [];

  depto: string = localStorage.getItem("deptoActivo");

  constructor(
    private afs: AngularFirestore, 
  ) { 
    this.info = new BehaviorSubject<any[]>(this.information);
    this.getInfo();
  }

  getInfo() {
    // this.depto = this.db.selectionDepto;
   
    this.allInfo = [];

    // let searchDepto: boolean = false;
    // this.save_depto.forEach((search) => {
    //   if (search == this.depto) {
    //     searchDepto = true;
    //   }
    // });
    // if (this.init_info.length == 0) {
      this.afs
        .collection("informacion")
        .ref.where("departamento", "==", this.depto)
        .where("publicado", "==", true)
        .get()
        .then((querySnapshot) => {
          const arrSlider: any[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrSlider.push({ id: item.id, ...data });
            this.init_info.push({ id: item.id, ...data });
            console.log(this.init_info)
          });

          this.allInfo = arrSlider;
          this.info.next(this.allInfo);
          // this.save_depto.push(this.depto);
          // searchDepto = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    // } else {
      // if (searchDepto) {
      //   this.init_slider.forEach((res) => {
      //     if (res.departamento == this.depto) {
      //       this.allSlider.push(res);
      //     }
      //   });
      // this.info.next(this.init_info);
    // }
  }
}
