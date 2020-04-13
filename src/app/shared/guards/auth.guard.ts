import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap,map } from 'rxjs/operators';


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
          
      return this.authService.isLoggedIn().pipe(
        take(1),
        map(user => {
          if (user) {
            return true;
          } else {
            return false;
          }
        }),
        tap(isAuthenticated => {
          if (!isAuthenticated) {                   
            console.log('ESTAS EN AUTHGUARD, Y NO ESTAS AUTENTICADO');
            this.router.navigateByUrl('/login')           
          }
        })
      )

  }
  
}
