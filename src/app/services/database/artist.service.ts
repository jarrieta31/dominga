import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Artistas } from "src/app/shared/artistas";
import { DatabaseService } from "../database.service";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  artist: BehaviorSubject<Artistas[]>;
  init_artist: Artistas[] = [];
  save_depto: string[] = [];
  depto: string;
  allArtist: Artistas[] = [];

  /**controla si la base devuelve datos */
  noData: boolean = false;

  constructor(private afs: AngularFirestore, private db: DatabaseService) {
    this.artist = new BehaviorSubject<Artistas[]>(this.init_artist);
  }

  getArtist(checkDepto: string) {
    this.depto = localStorage.getItem("deptoActivo");
    this.allArtist = [];

    let searchDepto: boolean = false;
    this.save_depto.forEach((search) => {
      if (this.depto !== null) {
        if (search == this.depto) {
          searchDepto = true;
        }
      } else {
        if (search == checkDepto) {
          searchDepto = true;
        }
      }
    });

    if (!searchDepto) {
      if (this.depto !== null) {
        this.afs
          .collection("artistas")
          .ref.where("departamento", "==", this.depto)
          .where("publicado", "==", true)
          .get()
          .then((querySnapshot) => {
            const arrArtist: Artistas[] = [];
            querySnapshot.forEach((item) => {
              const data: any = item.data();
              arrArtist.push({ id: item.id, ...data });
              this.init_artist.push({ id: item.id, ...data });
            });

            this.allArtist = arrArtist;

            if (querySnapshot.size !== 0) {
              this.save_depto.push(this.depto);
              this.noData = false;
            } else this.noData = true;

            this.artist.next(this.allArtist);
            searchDepto = false;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => "Fin");
      } else {
        this.afs
          .collection("artistas")
          .ref.where("departamento", "==", checkDepto)
          .where("publicado", "==", true)
          .get()
          .then((querySnapshot) => {
            const arrArtist: Artistas[] = [];
            querySnapshot.forEach((item) => {
              const data: any = item.data();
              arrArtist.push({ id: item.id, ...data });
              this.init_artist.push({ id: item.id, ...data });
            });

            this.allArtist = arrArtist;

            if (querySnapshot.size !== 0) {
              this.save_depto.push(checkDepto);
              this.noData = false;
            } else this.noData = true;

            this.artist.next(this.allArtist);
            searchDepto = false;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => "Fin");
      }
    } else if (searchDepto) {
      if (this.depto !== null) {
        this.init_artist.forEach((res) => {
          if (res.departamento == this.depto) {
            this.allArtist.push(res);
          }
        });
      } else {
        this.init_artist.forEach((res) => {
          if (res.departamento === checkDepto) {
            this.allArtist.push(res);
          }
        });
      }

      this.artist.next(this.allArtist);
    }

    return this.artist;
  }
}
