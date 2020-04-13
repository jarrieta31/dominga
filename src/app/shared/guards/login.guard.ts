import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, timer, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {  
  res: boolean
  constructor (private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isLoggedIn().pipe(
        take(1),
        map(user => {
          if (!user) {
            return true;
          } else {
            return false;
          }
        }),
        tap(notIsAuthenticated => {
          if (notIsAuthenticated) {            
            console.log('NO EXISTE NINGUN USUARIO');
          } else {           
            console.log('SI HAY UN USUARIO LOGUEADO');
            this.router.navigateByUrl('/home')           
          }
        })
      )     
     
  }

  validarEntrada() {
    this.authService.isLoggedIn().pipe(
      tap(user => {
        if (user) {          
          console.log('REALMENTE HAY UN USARIO LOGUEADO');          
        } else {          
          console.log('REALMENTE NO EXISTE NINGUN USUARIO');          
        }
      })
    )
    .subscribe()
  }

  

  
}
