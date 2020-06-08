import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import AuthProvider = firebase.auth.AuthProvider;
import { Observable, from } from 'rxjs';
import { tap, map, first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User | null >;

  constructor( private afAuth: AngularFireAuth, private router: Router ) { 
    // authState es la instancia de autentificación actual
    this.user = this.afAuth.authState;   
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first())
  }

  // Registro con email
  signUpWithEmail(email:string, pass:string): Promise<firebase.auth.UserCredential> {
    try {
      const res = this.afAuth.createUserWithEmailAndPassword(email,pass)
      console.log('Registro correcto!')
      return res
    } catch (error) {
      console.log('Error en registro con email: ', error.message);
    }
  }
  
  // Ingreso con email
  signInWithEmail(email:string, pass:string): Promise<firebase.auth.UserCredential>{
    try {
      const res = this.afAuth.signInWithEmailAndPassword(email,pass)
      console.log('Ingreso con email correcto')
      return res
    } catch (error) {
      console.log('Error en ingreso con email: ', error)
    }       
  }
  
  // Obtener el observador del usuario actual
  get currentUser(){
    try {
      return this.user;
    } catch (error) {
      console.log("error al obtener el usuario actual");
    }
  }

  // Finalizar sesión
  signOut() {   
    this.afAuth.signOut().then((res) => {
      console.log('saliste', res);
      this.router.navigateByUrl('/login');
    }).catch((res)=>{
      console.log('error en signOut');
    })
  }

  // Recuperar contraseña
  resetPassword(email:string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error al recuperar contraseña: ', error);
    }  
  }

  // Autenticación con Google
  authWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    try {
      return this.afAuth.signInWithPopup(new  firebase.auth.GoogleAuthProvider());
    } catch (error) {
      console.log('Error en autenticación con google: ', error);
    }  
  }

}
