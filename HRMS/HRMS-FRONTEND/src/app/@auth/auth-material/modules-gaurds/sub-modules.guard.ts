import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubModulesGuard implements CanActivate {
  constructor(private router:Router, private _authService:AuthService){
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // 
      // 
      let re = this._authService.chakeSubModules(route.url[0].path)
      if (re.pass) {
      return true
    } else {
      alert('Not Accessible');
      return false
    }
  }
  
}
