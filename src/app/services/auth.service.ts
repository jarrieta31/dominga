import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import AuthProvider = firebase.auth.AuthProvider;
import { Observable, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User } from '../shared/user.class';
import { UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged :any = false;
  private user: Observable<firebase.User | null >;


  constructor( private afAuth: AngularFireAuth, private storage: Storage ) { 
    //Si el usuario está logueado devuelve true y null en caso contrario
    afAuth.authState.subscribe( user => {
      this.isLogged = true
      
    })
    // this.afAuth.authState.subscribe(user => {
    //   this.user = user;
    // })
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

  // Auto login
  autoLogin(){   
     
    return from(this.storage.get('authData')).pipe(
      map(storedData => {
        if(storedData == '' || storedData == null){
          return null
        }          
        //Convierte los datos de string a un objeto json
        const parsedData = JSON.parse(storedData) as {email: string; password: string}
        return parsedData
      }),
      tap(datos => {
        console.log(`Datos almacenados: email: ${datos.email}, password: ${datos.password}`);
        this.signInWithEmail(datos.email, datos.password).then((res) => {
          if(res === null){
            return false
          }else{
            return true
          }
        });
      }),
      map(res => {
        if(res){
          return true
        }else{
          return false
        }
      }),
      tap(res => {
        console.log('respuesta de autologin:', res)
      })
    )    
  }

  // Obtener el estado de autenticación
  get authenticated():boolean {
    // True ó False
    return this.isLogged  
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
    this.isLogged = false
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

  // Es necesario instalar "Ionic Storage" con los siguientes comandos:
  // ionic cordova plugin add cordova-sqlite-storage
  // npm install --save @ionic/storage
  public storeAuthData(email: string, password: string) {  
    const data = JSON.stringify({email: email, password: password});
    // set a key/value
    this.storage.set('authData', data);
    console.log("estoy en storeAuthData");
    // Or to get a key/value pair
    this.storage.get('authData').then((val) => {
      console.log('La informacion almacenada es: ', val);
    });    
  }

  
  

}
