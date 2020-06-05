import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { map, catchError, takeLast, take, flatMap } from 'rxjs/operators';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-mynotifications',
  templateUrl: './NotificationList.component.html',
  styleUrls: ['./NotificationList.component.scss'],
})
export class NotificationListComponent implements OnInit {

  public NotificationsUrl = "Notification/GetNotificationListByUser";
  public DeleteNotifications = "Notification/Delete";

  public sub: any;
  public userID: any;
  public PageTitle: string = "Bildirimler";

  public notificationsData: any[] = undefined;
  public itemsChecked: any[] = [];
  public selectedItem: any;
  public allItems: any[];

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private authenticationservice: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });
    this.initializeNotifications();
  }

  initializeNotifications() {
    let params = { Filter: {}, Paging: {}, Sorting: {} };
    this.authenticationservice.getUserToken().pipe(
      take(1),
      map(token => { if (token == undefined) { return ""; } return token; }),
      flatMap(token => this.dataApiService.PostDataWithToken(this.NotificationsUrl, params, token))
    ).subscribe((resolvedNotifications: any) => { this.notificationsData = resolvedNotifications.Data.List })
  }

  oncheckItem(ischecked: boolean, NotificationId: any) {
    let index = this.itemsChecked.indexOf(NotificationId);
    if (ischecked) {
      if (index < 0) {
        this.itemsChecked.push(NotificationId);
      }
    }
    else {
      if (index >= 0) {
        this.itemsChecked.splice(index, 1);
      }
    }
  }

  onDeleteMultipleItems() {
    // console.log(this.itemsChecked);
    this.dataApiService.PostData(this.DeleteNotifications, { NotificationIDList: this.itemsChecked }).subscribe(res => {
      if (res.Data) {
        this.initializeNotifications()
      }
    })
  }

  onDeleteSingleItem(item) {
    this.dataApiService.PostData(this.DeleteNotifications, { NotificationIDList: [item.NotificationID] }).subscribe(res => {
      if (res.Data) {
        this.initializeNotifications()
      }
    })
  }

  onDeleteAllItems() {
    if (this.notificationsData !== undefined) {
      let items = [];
      this.notificationsData.forEach(item => {
        items.push(item.NotificationID);
      })
      this.dataApiService.PostData(this.DeleteNotifications, { NotificationIDList: items }).subscribe(res => {
        if (res.Data) {
          this.initializeNotifications()
        }
      })
    }
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
