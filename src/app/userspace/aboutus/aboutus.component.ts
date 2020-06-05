import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { switchMap, catchError, map } from 'rxjs/operators';
import { EMPTY, of, from } from 'rxjs';

@Component({
  selector: 'app-aboutus',
  templateUrl: './AboutUs.component.html',
  styleUrls: ['./AboutUs.component.scss'],
})
export class AboutUsComponent implements OnInit {
  public sub: any;
  public userID: any;
  public PageTitle: string = "Hakkımızda";
  public getVersionUrl: string = "Common/GetVersionNumber";
  public appversion: string;
  public globalversion: string;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private appVersion: AppVersion) { }

  ngOnInit() {
    this.sub = from(this.appVersion.getVersionNumber()).pipe(
      switchMap(resolvedParams => {
        this.appversion = resolvedParams;
        return this.dataApiService.PostData(this.getVersionUrl, { uiVersion: this.appversion })
      }),
      map(resolvedVersion => { this.globalversion = resolvedVersion }),
      catchError(err => { return of(null) })
    ).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleMenu() {
    // this.menu.enable(true, "MainMenu");      enable the menu later
    this.menu.toggle();
  }

  navigate(params) {
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

}
