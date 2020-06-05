import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';

@Component({
  selector: 'app-myizcilist',
  templateUrl: './IzciList.component.html',
  styleUrls: ['./IzciList.component.scss'],
})
export class IzciListComponent implements OnInit {

  public getIzciListUrl: string = "Izci/GetIzciByUniteID";
  public sub: any;
  public userID: any;
  public unityId: any;
  public PageTitle: string = "İzcilerim";
  public izciListData: any[] = [];

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router,
    private storage: Storage, private dataApiservice: DataApiService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id'];
      this.unityId = params['UnityId'];  // (+) converts string 'id' to a number

      this.dataApiservice.PostData(this.getIzciListUrl, { uniteID: this.unityId }).subscribe((resolvedIzcilist: any) => {
        if (resolvedIzcilist !== null)
          this.izciListData = resolvedIzcilist.Data;
      }, err => { console.log(err) });
    }, err => { console.log(err) })
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


