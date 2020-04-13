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

      console.log('loginGuard 1, authenticated vale: ',this.authService.authenticated)
      if(this.authService.authenticated){
        console.log('loginGuard 1, esta autenticado y se redirecciona al home');
        this.router.navigate(['/home'])
        return false;
      }else{        
        if(this.authService.autoLogin()){
          console.log('loginGuard 2, se autologueo y se redirecciona al home');
          this.router.navigate(["/home"]);
          return false
        }else{
          console.log('loginGuard 3');
          return true
        }
      }

        
  }

  
}
