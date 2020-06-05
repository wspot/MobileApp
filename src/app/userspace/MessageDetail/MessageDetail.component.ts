import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Component({
  selector: 'app-messagedetails',
  templateUrl: './MessageDetail.component.html',
  styleUrls: ['./MessageDetail.component.scss'],
})
export class MessageDetailComponent implements OnInit {
  public sub: any;
  public userID: any;
  public GroupID: any;

  public token: string;

  public getMessageDetailUrl: string = "Message/GetGroupDetails";
  public MessagesData: any[] = [];
  public DetailsHeader: any;
  public groupUsers: string;
  public Subject: any;

  public TotalCount: number;
  public SearchParams: any = {
    Filter: { GroupID: undefined },
    Paging: { Count: 10, PageNumber: 1 },
    Sorting: { ColName: "MessageID", Direction: "0" }
  }


  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService,
    private storage: Storage, private authservice: AuthenticationService) { }

  ngOnInit() {
    this.groupUsers = this.router.getCurrentNavigation().extras.state.groupUsers;
    this.Subject = this.router.getCurrentNavigation().extras.state.Subject;
    //this.groupUsers = "Furkan Türküzel,MUHUBETTİN POLAT,ARİF TAŞKIN,RAMAZAN KARTAL";

    this.sub = this.route.params.pipe(
      switchMap(params => {
        this.userID = params['id'];
        this.GroupID = params['Gid'];
        return this.authservice.getUserToken();
      }),
      switchMap(resolvedToken => {
        this.token = resolvedToken;
        this.SearchParams.Filter.GroupID = this.GroupID;
        return this.dataApiService.PostDataWithToken(this.getMessageDetailUrl, this.SearchParams, this.token);
      }),
      map((resolvedMessages: any) => {
        this.MessagesData = resolvedMessages.Data.List;
        this.DetailsHeader = resolvedMessages.Data.List[0];
        this.TotalCount = resolvedMessages.Data.TotalCount
        // console.log(this.DetailsHeader);
      }),
      catchError(err => { console.log(err); return of(null) })
    ).subscribe();
  }

  ionViewDidLeave() {
    console.log("Messagedetails  view left");
    this.SearchParams.Paging.PageNumber = 1;
    this.sub.unsubscribe();
  }

  loadData(event) {
    if (this.MessagesData.length == this.TotalCount) {
      event.target.complete();
    } else {
      this.SearchParams.Paging.PageNumber++;
      this.dataApiService.PostDataWithToken(this.getMessageDetailUrl, this.SearchParams, this.token).subscribe(
        (resolvedMessages: any) => {
          if (resolvedMessages !== null) {
            this.MessagesData = this.MessagesData.concat(resolvedMessages.Data.List);
          } else {
            this.SearchParams.Paging.PageNumber--
          }
          event.target.complete();
        }, err => {
          event.target.complete()
          if (this.SearchParams.Paging.PageNumber > 1) {
            this.SearchParams.Paging.PageNumber--
          }
        }
      )
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

  respondToConversation() {
    this.router.navigate(['/user/1/messagesave/' + this.GroupID], { state: { sender: this.DetailsHeader.UserSender.Name, Subject: this.Subject } });
  }

}
