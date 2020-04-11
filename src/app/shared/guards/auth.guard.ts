import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap, switchMap,map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private authService: AuthService, private router: Router){}

  /* Este guard solo deja ingresar al los usuarios que están autenticados, si no lo está intenta
    autenticarse con los datos almacenados
  */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      // return this.authService.userIsAuthenticated.pipe(
      //   take(1),
      //   switchMap(isAuthenticated => {
      //     if(!isAuthenticated){//Si no está logueado intenta ingresar con los datos guardados
      //       return this.authService.autoLogin(); //Llama al método autoLogin
      //     }else{
      //       return of(isAuthenticated); //nuevo observable
      //     }
      //   }),
      //   tap(isAuthenticated => {
      //     // console.log("authGuard 2, ",isAuthenticated);
      //     // console.log("authGuard 3",typeof isAuthenticated);
      //     if(!isAuthenticated){
      //       this.router.navigateByUrl("/login");
      //     }
      //   })
      // )
      if(this.authService.authenticated){
        console.log('authGuard 1');
        return true
      }else{
        //this.router.navigateByUrl('/login')
        console.log('authGuard 2');
        return true
      }      
  }
  
}
