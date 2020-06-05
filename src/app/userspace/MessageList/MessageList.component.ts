import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { switchMap, map, filter } from 'rxjs/operators';
import { FCM } from '@ionic-native/fcm/ngx';
import { of } from 'rxjs';

@Component({
  selector: 'app-mymessages',
  templateUrl: './MessageList.component.html',
  styleUrls: ['./MessageList.component.scss'],
})
export class MessageListComponent implements OnInit {
  public sub: any;
  private messagesSubscribtion: any;
  public userID: any;
  public userName: any;
  public usersurName: any;
  public PageTitle: string = "MESAJLAR";
  public token: string;

  public getMessagesUrl: string = "Message/GetUserGroupList";
  public MessagesData: any[] = [];
  private notifSubs: any;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router,
    private storage: Storage, private dataApiService: DataApiService, private authenticationService: AuthenticationService, private fcm: FCM) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });

    this.messagesSubscribtion = this.authenticationService.getUserToken().pipe(
      switchMap((resolvedToken) => {
        this.token = resolvedToken;
        return this.dataApiService.PostDataWithToken(this.getMessagesUrl, {}, this.token);
      }),
      switchMap((resolvedMessages) => {
        this.MessagesData = resolvedMessages.Data.List;
        return this.authenticationService.getUserInfos();
      }),
      map((resolvedInfs) => {
        // console.log(resolvedInfs)
        if (resolvedInfs !== null) {
          this.userName = resolvedInfs.Name;
          this.usersurName = resolvedInfs.Surname;
        }
      })
    ).subscribe();

    this.notifSubs = this.fcm.onNotification().pipe(
      filter((notification: any) => notification.NotificationType == "Chat"),
      switchMap(resolvedNotif => {
        console.log("received message notif", resolvedNotif);
        return this.dataApiService.PostDataWithToken(this.getMessagesUrl, {}, this.token);
      }),
      switchMap((resolvedMessages) => {
        this.MessagesData = resolvedMessages.Data.List;
        if (this.userName !== undefined && this.usersurName !== undefined) {
          return this.authenticationService.getUserInfos();
        } else {
          return of({ Name: this.userName, Surname: this.usersurName });
        }
      }),
      map((resolvedInfs) => {
        // console.log(resolvedInfs)
        this.userName = resolvedInfs.Name;
        this.usersurName = resolvedInfs.Surname;
      })
    ).subscribe()
  }

  // old init data
  initializeData() {
    this.storage.get("token").then((resolvedToken: any) => {
      this.token = resolvedToken;
      // getting the users informations
      this.dataApiService.PostDataWithToken(this.getMessagesUrl, {}, this.token).subscribe((resolvedMessages: any) => {
        this.MessagesData = resolvedMessages.Data.List;
      }, err => { console.log(err) });
    }, err => { console.log(err) });

    this.authenticationService.getUserInf().subscribe(resolvedInfs => {
      console.log(resolvedInfs)
      this.userName = resolvedInfs.Name;
      this.usersurName = resolvedInfs.Surname;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.messagesSubscribtion.unsubscribe();
    this.notifSubs.unsubscribe();
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
  onSendNewMessage() {
    // this.navigate('/user/1/messagesave');
    this.router.navigate(['/user/1/messagesave'], { state: { sender: this.userName + ' ' + this.usersurName, Subject: undefined } });
  }

  goToDetails(groupID, list, subject) {
    this.router.navigate(['/user/1/messagedetails/' + groupID], { state: { groupUsers: list, Subject: subject } });
  }

}
