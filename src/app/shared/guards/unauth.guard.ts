import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      tap( isAuthenticated => {
        console.log(isAuthenticated);
        if(isAuthenticated){
          console.log("En si esta autentidado: " + isAuthenticated);
          this.router.navigateByUrl("/home");
          return false;
        }else{
          return true;
        }      
      })
    );
  }
  
}
