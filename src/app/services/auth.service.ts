import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import AuthProvider = firebase.auth.AuthProvider;
import { Observable, from } from 'rxjs';
import { tap, map, first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User | null >;

  constructor( private afAuth: AngularFireAuth, private storage: Storage ) { 
    // authState es la instancia de autentificación actual
    this.user = this.afAuth.authState;    
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first())
  }

  // Registro con email
  signUpWithEmail(email:string, pass:string): Promise<firebase.auth.UserCredential> {
    try {
      const res = this.afAuth.auth.createUserWithEmailAndPassword(email,pass)
      console.log('Registro correcto!')
      return res
    } catch (error) {
      console.log('Error en registro con email: ', error.message);
    }
  }
  
  // Ingreso con email
  signInWithEmail(email:string, pass:string): Promise<firebase.auth.UserCredential>{
    try {
      const res = this.afAuth.auth.signInWithEmailAndPassword(email,pass)
      console.log('Ingreso con email correcto')
      return res
    } catch (error) {
      console.log('Error en ingreso con email: ', error)
    }       
  }
  
  // Obtener el observador del usuario actual
  get currentUser(){
    return this.user;
  }

  // Finalizar sesión
  signOut(): Promise<void> {
    this.storage.clear(); //borra los datos almacenados
    this.storage.get('authData').then((val) => {
      console.log('datos almacenados: ', val);
    })
    return this.afAuth.auth.signOut();
  }

  // Recuperar contraseña
  resetPassword(email:string): Promise<void> {
    try {
      return this.afAuth.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error al recuperar contraseña: ', error);
    }  
  }

  // Autenticación con Google
  authWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    try {
      return this.afAuth.auth.signInWithPopup(new  firebase.auth.GoogleAuthProvider());
    } catch (error) {
      console.log('Error en autenticación con google: ', error);
    }  
  }

  // Auto login
  // autoLogin(){     
  //   return from(this.storage.get('authData')).pipe(
  //     map(storedData => {
  //       if(storedData == '' || storedData == null){
  //         return null
  //       }          
  //       //Convierte los datos de string a un objeto json
  //       const parsedData = JSON.parse(storedData) as {email: string; password: string}
  //       return parsedData
  //     }),
  //     tap(datos => {
  //       console.log(`Datos almacenados: email: ${datos.email}, password: ${datos.password}`);
  //       this.signInWithEmail(datos.email, datos.password).then((res) => {
  //         if(res === null){
  //           return false
  //         }else{
  //           return true
  //         }
  //       });
  //     }),
  //     map(res => {
  //       if(res){
  //         return true
  //       }else{
  //         return false
  //       }
  //     }),
  //     tap(res => {
  //       console.log('respuesta de autologin:', res)
  //     })
  //   )    
  // }

  // Es necesario instalar "Ionic Storage" con los siguientes comandos:
  // ionic cordova plugin add cordova-sqlite-storage
  // npm install --save @ionic/storage
  // public storeAuthData(email: string, password: string) {  
  //   const data = JSON.stringify({email: email, password: password});
  //   // set a key/value
  //   this.storage.set('authData', data);
  //   console.log("estoy en storeAuthData");
  //   // Or to get a key/value pair
  //   this.storage.get('authData').then((val) => {
  //     console.log('La informacion almacenada es: ', val);
  //   });    
   

  // private updateUserData(user) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const data: User = {
  //     id: user.uid,
  //     email: user.email
  //   }
  //   return userRef.set(data, { merge: true })
  // }

  //  loginFacebookUser() {
  //   return this.afsAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
  //     .then(credential => this.updateUserData(credential.user))
  // }

}
