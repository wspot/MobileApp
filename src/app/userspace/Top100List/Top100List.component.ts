import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';

@Component({
  selector: 'app-toprating',
  templateUrl: './Top100List.component.html',
  styleUrls: ['./Top100List.component.scss'],
})
export class Top100ListComponent implements OnInit {
  public sub: any;
  public userID: any;
  public PageTitle: string = "Top 100";

  public getTopListUrl: string = "Izci/IzciListTopScore";
  public topListData: any[] = [];
  public topListCount: number = 0;

  public Filter: any = {};

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });


    if (this.router.getCurrentNavigation().extras["Filter"] !== undefined) {
      this.Filter = this.router.getCurrentNavigation().extras.state.Filter;
    }

    this.dataApiService.PostData(this.getTopListUrl, { Paging: {}, Filter: this.Filter, Sorting: { Rank: 1 } }).subscribe(resolvedItems => {
      this.topListData = resolvedItems.Data.List;
      this.topListCount = resolvedItems.Data.TotalCount;
    }, err => { })
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

/*  test */
