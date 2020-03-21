import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../shared/user.model';

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
  private _token = new BehaviorSubject<string>('');


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
    return this._user.asObservable().pipe( map(user => {
      if (user){
        return user.id 
      }else{
        return null;
      }
    }));
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    console.log("eston en signup");
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
  }

  //Guarda todos los datos del usuario devueltos en la respuesta
  private setUserData(userData: AuthResponseData){
    //Hora de expiracion es la hora actual + 1 hora en milisegundos
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 1000)
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
  }

  private storeAuthData(
    userId: string, 
    token: string, 
    tokenExpirationDate: string) {

    // Hay que probar si el token sigue siendo válido
    

  }

}
