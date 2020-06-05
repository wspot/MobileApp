import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  private sub: any;
  private sub2: any;
  private userID: any;
  public userPermissions: any = {};

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.menu.swipeGesture(false);
    this.sub = this.route.params.pipe(
      switchMap(params => {
        this.userID = params['id']; // (+) converts string 'id' to a number
        // In a real app: dispatch action to load the details here.
        return this.authService.getUserPermissions();
      }),
      map(resolvedPermissions => {
        // console.log(resolvedPermissions);
        this.userPermissions = resolvedPermissions;
      })
    ).subscribe();
    this.sub2 = fromEvent(this.authService.PermissionsUpdated, "permissions").pipe(
      switchMap(resp => {
        return this.authService.getUserPermissions();
      }),
      map(resolvedPerms => {
        this.userPermissions = resolvedPerms;
      }),
      catchError(err => {
        console.log(err);
        return of([])
      })
    ).subscribe();

    fromEvent(this.authService.AuthenticationEvent, "LogoutEvent").subscribe(resolvedResp => {
      this.menu.swipeGesture(false);
    })
    fromEvent(this.authService.AuthenticationEvent, "LogInEvent").subscribe(resolvedResp => {
      this.menu.swipeGesture(true);
    })


  }


  navigate(params) {
    this.router.navigate([params]);
    this.menu.close();
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

}
