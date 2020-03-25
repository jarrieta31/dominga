import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return this.authService.userIsAuthenticated.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if(!isAuthenticated){//Si no está logueado intenta ingresar con los datos guardados
            return this.authService.autoLogin(); //Llama al método autoLogin
          }else{
            return of(isAuthenticated); //nuevo observable
          }
        }),
        tap(isAuthenticated => {
          if(!isAuthenticated){
            this.router.navigateByUrl("/login");
          }
        })
      )

  }
  
}
