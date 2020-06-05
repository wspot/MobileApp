import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';

@Component({
  selector: 'app-mychildslist',
  templateUrl: './mychildslist.component.html',
  styleUrls: ['./mychildslist.component.scss'],
})
export class MychildslistComponent implements OnInit {

  public getChildrensUrl: string = "Izci/GetIzciByParent";
  public sub: any;
  public userID: any;
  public PageTitle: string = "Çocuklarım";
  public token: string;
  public childrenListData: any[] = [];

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private storage: Storage, private dataApiservice: DataApiService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });

    this.storage.get("token").then((resolvedToken: any) => {
      this.token = resolvedToken;
      this.dataApiservice.PostDataWithToken(this.getChildrensUrl, {}, this.token).subscribe((resolvedChildrens: any) => {
        this.childrenListData = resolvedChildrens.Data;
      }, err => { console.log(err); });
    }, err => { console.log(err); });
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
