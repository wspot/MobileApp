import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';

@Component({
  selector: 'app-unite-list',
  templateUrl: './unite-list.component.html',
  styleUrls: ['./unite-list.component.scss'],
})
export class UniteListComponent implements OnInit {
  public PageTitle: string = "Ünitelerim";
  public getUnitiesUrl: string = "Izci/GetUniteByLeader";
  public token: string;

  public unitiesData: any[] = [];

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router,
    private storage: Storage, private dataApiservice: DataApiService) { }

  ngOnInit() {
    this.storage.get("token").then((resolvedToken: any) => {
      this.token = resolvedToken;
      this.dataApiservice.PostDataWithToken(this.getUnitiesUrl, {}, this.token).subscribe((resolvedUnities: any) => {
        this.unitiesData = resolvedUnities.Data;
      }, err => { console.log(err); });
    }, err => { console.log(err); });
  }

  onChooseUnity(Uid: any) {
    this.navigate("/user/1/izcilist/" + Uid);
  }

  navigate(params) {
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

}
