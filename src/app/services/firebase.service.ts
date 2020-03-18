import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Place } from '../shared/place';
import { Observable } from 'rxjs';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  // placeListRef: AngularFireList<any>;
  // placeRef: AngularFireObject<any>;
  // item: Observable<any>;

  constructor() {
}


  // constructor( private db: AngularFireDatabase ) {
  //   this.placeListRef = this.db.list('/place');
    
  // }

  // // Create
  // createPlace(place: Place) {
  //   //const listRef = this.db.list('places');
  //   return this.placeListRef.push({
  //     name: place.name,
  //     description: place.description,
  //     position: place.position,
  //     image: place.image,
  //     audio: place.audio,
  //     video: place.video
  //   })
  // }

  // // Get Single
  // getPlace(id: string) {
  //   this.placeRef = this.db.object('/place/' + id);

  //   return this.placeRef;
  // }

  // // Get List
  // getPlaceList() {
  //   this.placeListRef = this.db.list('/place');
  //   return this.placeListRef;
  // }

  // // Update
  // updatePlace(id, place: Place) {
  //   return this.placeRef.update({
  //     name: place.name,
  //     description: place.description,
  //     position: place.position,
  //     image: place.image,
  //     audio: place.audio,
  //     video: place.video
  //   })
  // }

  // // Delete
  // deletePlace(id: string) {
  //   this.placeRef = this.db.object('/place/' + id);
  //   this.placeRef.remove();
  // }
}
