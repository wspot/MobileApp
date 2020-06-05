import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // this.authService.fetchStorage();
    // this.authService.showCredentials();
    return this.authService.isUserConnected().pipe(
      map(resp => {
        if (resp) {
          this.router.navigateByUrl('/user/1');
          return false;
        } else {
          return true;
        }
      }), catchError((err) => {
        console.log(false);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
