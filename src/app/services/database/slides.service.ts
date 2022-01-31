import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Slider } from "src/app/shared/slider";
//import { DatabaseService } from "../database.service";

@Injectable({
  providedIn: "root",
})
export class SlidesService {
  slider: BehaviorSubject<Slider[]>;
  init_slider: Slider[] = [];
  // save_depto: String[] = [];
  // depto: String;
  allSlider: Slider[] = [];

  constructor(
    private afs: AngularFirestore, 
    //private db: DatabaseService
    ) 
    {
    this.slider = new BehaviorSubject<Slider[]>(this.init_slider);
  }

  getSliders() {
    // this.depto = this.db.selectionDepto;
    this.slider = new BehaviorSubject<Slider[]>(this.init_slider);
    this.allSlider = [];

    // let searchDepto: boolean = false;
    // this.save_depto.forEach((search) => {
    //   if (search == this.depto) {
    //     searchDepto = true;
    //   }
    // });

    if (this.init_slider.length == 0) {
      this.afs
        .collection("sliders")
        .ref.where("publicado", "==", true)
        .get()
        .then((querySnapshot) => {
          const arrSlider: Slider[] = [];
          querySnapshot.forEach((item) => {
            const data: any = item.data();
            arrSlider.push({ id: item.id, ...data });
            this.init_slider.push({ id: item.id, ...data });
          });

          this.allSlider = arrSlider;
          this.slider.next(this.allSlider);
          // this.save_depto.push(this.depto);
          // searchDepto = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    } else {
      // if (searchDepto) {
      //   this.init_slider.forEach((res) => {
      //     if (res.departamento == this.depto) {
      //       this.allSlider.push(res);
      //     }
      //   });
      this.slider.next(this.init_slider);
    }
  }
}
