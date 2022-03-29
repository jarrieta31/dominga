import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Slider } from "src/app/shared/slider";

@Injectable({
  providedIn: "root",
})
export class SlidesService {
  slider: BehaviorSubject<Slider[]>;
  init_slider: Slider[] = [];
  allSlider: Slider[] = [];

  constructor(
    private afs: AngularFirestore
  ) {
    this.slider = new BehaviorSubject<Slider[]>(this.init_slider);
  }

  getSliders() {
    this.allSlider = [];

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
          this.allSlider = JSON.parse(JSON.stringify(arrSlider));
          this.slider.next(this.allSlider);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => "Fin");
    } else {
      this.slider.next(this.init_slider);
    }
  }
}
