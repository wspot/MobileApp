import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { take, map, flatMap } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-annoucements',
  templateUrl: './AnnoucementList.component.html',
  styleUrls: ['./AnnoucementList.component.scss'],
})
export class AnnoucementListComponent implements OnInit {
  public sub: any;
  public userID: any;
  public PageTitle: string = "Duyurular";
  public AnnoucementsUrl = "Announcement/GetAnnouncementList";
  public annoucementData: any[];

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private authenticationservice: AuthenticationService, private iab: InAppBrowser) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });
    this.initializeAnnoucements();
  }

  initializeAnnoucements() {
    let params = { Filter: {}, Paging: {}, Sorting: { ColName: "Date", Direction: 0 } };
    this.authenticationservice.getUserToken().pipe(
      take(1),
      map(token => { if (token == undefined) { return ""; } return token; }),
      flatMap(token => this.dataApiService.PostDataWithToken(this.AnnoucementsUrl, params, token))
    ).subscribe((resolvedAnnoucements: any) => {
      if (resolvedAnnoucements)
        this.annoucementData = resolvedAnnoucements.Data.List
    }, err => { console.log(err); })
  }

  onClickLink(link) {
    const browser = this.iab.create(link);
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
