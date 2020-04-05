import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, timer, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap, switchMap, timeInterval, map, mergeMap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {  

  constructor (private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.userIsAuthenticated.pipe(
        take(1),
        tap((isAuthenticated) => console.log("loginGuard 1, ",isAuthenticated)),
        switchMap(isAuthenticated => {
          if(!isAuthenticated){//Si no está logueado intenta ingresar con los datos guardados
            return this.authService.autoLogin(); //Llama al método autoLogin
          }else{
            return of(isAuthenticated); //nuevo observable
          }
        }),
        tap(x => {console.log("loginGuard 2, ",x)}),
        map(isAuthenticated => {
          if(!isAuthenticated){
            return true;
          }else{
            return false;
          }
        }),
        tap(notIsAuthenticated => {
          console.log("loginGuard 3, ",notIsAuthenticated);
          console.log("loginGuard 4",typeof notIsAuthenticated);
          if(!notIsAuthenticated){
            console.log("loginGuard 5, ",notIsAuthenticated);
            this.router.navigateByUrl("/home");
          }
        })
      )
        
  }

  
}
