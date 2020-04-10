import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../shared/user.model';
import { Storage } from '@ionic/storage';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  //expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _user = new BehaviorSubject<User>(null);
  private _token = new BehaviorSubject<string>("");


  constructor(
    private http: HttpClient, 
    private storage: Storage, 
    //private afsAuth: AngularFireAuth,
    //private afs: AngularFirestore
    ) {}

  //
  autoLogin() {
    //Obtiene los datos almacenados y los convierte en un observable para obtener una promesa
    //Con el operador mapa convierto los datos en string
    return from (this.storage.get('authData')).pipe(
      map(storedData => {
        // console.log("autoLogin 1, storedData: ", storedData);
        //Si no hay datos o si el valor es null
        
        if(storedData == "" || storedData == null){
          // console.log("autoLogin 2, No hay datos almacenados");
          return null;
        }
        //Convierte los datos de string a un objeto json
        const parsedData = JSON.parse(storedData) as {
          tonken: string; 
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        //Variable para convertir el tiempo de expiración en fecha
        console.log("Fecha de expiración: ", parsedData.tokenExpirationDate);
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        //Si el tiempo de expiración no es válido
        if(expirationTime <= new Date()){
          // console.log("autoLogin 3, se superó el tiempo de expiración");
          return null;
        }
        //Se crea un nuevo usuario con los dato almacenados
        // console.log("autoLogin 4, Se creó una nueva instancia de usuario con los datos almacenados");
        const user = new User(
          parsedData.userId, 
          parsedData.email, 
          parsedData.tonken, 
          expirationTime
        );
        return user;
      }),
      tap( user => {
        // Si se creó el usuario
        if(user){
          this._user.next(user);
        }
      }),
      // Dado que el metodo debe devolver un boolean se hace este último paso
      map(user => {
        return !!user;
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user){
          return !!user.token;
        }else{
          return false;
        }
      }));
  }

  // Obtiene el id o devuelve falso
  get userId() {
    return this._user.asObservable().pipe( 
      map(user => {
        if (user){
          return user.id 
        }else{
          return null;
        }
      })
    );
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
        environment.firebaseAPIKey
      }`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap( this.setUserData.bind(this) ));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
        environment.firebaseAPIKey
      }`,
      { email: email, password: password, returnSecureToken:true }
    )
    .pipe(tap( this.setUserData.bind(this) ));
  }

  logout() {
    this._user.next(null);
    this.clearSotreAuthData(); //Borra todos los datos almacenados
  }

  //Guarda todos los datos del usuario devueltos en la respuesta
  private setUserData(userData: AuthResponseData){
    //Hora de expiracion es la hora actual + 1 hora en milisegundos
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 10000 * 1000)
    );
    //Guardo los datos del usuario que vino en la respuesta
    this._user.next( 
      new User(
        userData.localId, 
        userData.email, 
        userData.idToken, 
        expirationTime
      )
    );
    
    //Llama a la funcion storeAuthData para almacenar los datos
    this.storeAuthData(
      userData.localId, 
      userData.idToken, 
      expirationTime.toISOString(),
      userData.email);
  }

  // Es necesario instalar "Ionic Storage" con los siguientes comandos:
  // ionic cordova plugin add cordova-sqlite-storage
  // npm install --save @ionic/storage
  private storeAuthData(
    userId: string, 
    token: string, 
    tokenExpirationDate: string,
    email: string) {
    
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email});
    // Hay que probar si el token sigue siendo válido
    // set a key/value
    this.storage.set('authData', data);
    console.log("estoy en storeAuthData");
    // Or to get a key/value pair
    this.storage.get('authData').then((val) => {
      console.log('La informacion almacenada es: ', val);
    });
    
  }

  private clearSotreAuthData(){
    this.storage.clear();
  }

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
