import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rozetmanagment',
  templateUrl: './BadgeList.component.html',
  styleUrls: ['./BadgeList.component.scss'],
})
export class BadgeListComponent implements OnInit {

  public sub: any;
  public userID: any;
  public PageTitle: string = "Arma Yönetimi";

  public getBadgesUrl: string = "Mission/GetBadgeList";
  public badgesData: any[] = [];
  public token: string;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiservice: DataApiService, private storage: Storage) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['Uid']; // (+) converts string 'id' to a number
    });
    let params = { "Filter": {}, "Paging": {}, "Sorting": { ColName: "BadgeID", Direction: 0 } };
    let observer: any;
    if (this.userID == undefined) {
      this.storage.get("token").then((resolvedToken: any) => {
        this.token = resolvedToken;
        this.dataApiservice.PostDataWithToken(this.getBadgesUrl, params, this.token).subscribe((resp: any) => {
          this.badgesData = resp.Data.List;
        }, err => { console.log(err); });
      });
    }
    else {
      params.Filter = { UserID: this.userID };
      this.dataApiservice.PostData(this.getBadgesUrl, params).subscribe((resp: any) => {
        this.badgesData = resp.Data.List;
      }, err => { console.log(err); });
    }
  }
  ngOnDestroy() {
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
