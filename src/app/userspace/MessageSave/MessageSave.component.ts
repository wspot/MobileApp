import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-message-save',
  templateUrl: './MessageSave.component.html',
  styleUrls: ['./MessageSave.component.scss'],
})
export class MessageSaveComponent implements OnInit {

  public sub: any;
  public GroupID: any;

  public getGroupMemberUrl: string = "Message/GetGroupMemberList";
  public getReceiversListUrl: string = "Message/GetReceiversByUser";
  public sendMessageUrl: string = "Message/Save";

  public groupUsers: any[] = [];
  public subject: string;
  public Username: any;
  public respondMode: boolean;
  public content: string;
  private token: string;
  public selectedUsers: any[] = [];

  private receiversSubscribtion: any;

  constructor(private router: Router, private dataApiService: DataApiService, private authservice: AuthenticationService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.GroupID = params['Gid'];
    });

    if (this.GroupID) {
      // console.log(this.router.getCurrentNavigation().extras.state);
      this.respondMode = true;
      this.Username = this.router.getCurrentNavigation().extras.state.sender;
      this.subject = this.router.getCurrentNavigation().extras.state.Subject;
      let params = {
        "Filter": {
          "GroupID": this.GroupID
        },
        "Paging": {},
        "Sorting": {}
      };
      let users = [];
      this.receiversSubscribtion = this.dataApiService.PostData(this.getGroupMemberUrl, params).subscribe((resolvedUsers: any) => {
        resolvedUsers.Data.List.forEach(function (item) {
          users.push(item.UserLoginID.toString());
        });
        this.selectedUsers = users;
        this.groupUsers = resolvedUsers.Data.List;
      }, err => { console.log(err) });
    } else {
      let state = this.router.getCurrentNavigation().extras.state;
      let receivername = (state !== undefined) ? this.router.getCurrentNavigation().extras.state.receiver : undefined;
      let receiverid = (state !== undefined) ? this.router.getCurrentNavigation().extras.state.userloginID : undefined;
      this.receiversSubscribtion = this.authservice.getUserToken().pipe(
        switchMap(resolvedToken => {
          this.token = resolvedToken;

          if (state !== undefined) {
            if (receivername !== undefined) {
              this.selectedUsers.push(receiverid.toString());
              this.respondMode = true;

              return of({ Data: [{ Name: receivername, UserLoginID: receiverid }] });
            }
          }
          return this.dataApiService.PostDataWithToken(this.getReceiversListUrl, {}, this.token);
        }),
        map(resolvedReceivers => {
          if (resolvedReceivers) {
            if (resolvedReceivers.Data) {
              resolvedReceivers.Data.forEach(item => {
                this.groupUsers.push({ GroupID: 1, Name: item.Name + ' ' + item.Surname, UserLoginID: item.UserLoginID });
              })
            }
          }
        }),
        catchError(err => { console.log(err); return of(null); })
      ).subscribe();

      this.Username = this.router.getCurrentNavigation().extras.state.sender;
      this.respondMode = false;
    }
  }

  sendMessage() {
    let selectedUsers = [];
    if (this.selectedUsers.length > 0) {
      this.selectedUsers.map(item => { selectedUsers.push(parseInt(item)) });
    }

    let params = {
      Subject: this.subject,
      Content: this.content,
      SendDate: new Date(),
      ReceiverIDList: selectedUsers
    }
    if (this.GroupID !== undefined) {
      params['GroupID'] = parseInt(this.GroupID);
    }

    this.getUsertoken().pipe(
      switchMap(resolvedToken => {
        return this.dataApiService.PostDataWithToken(this.sendMessageUrl, params, resolvedToken);
      }),
      catchError(err => { console.log(err); return of(null); })
    ).subscribe(response => {
      if (response) {
        if (!response.HasError) {
          (this.GroupID == undefined) ? this.router.navigate(['/user/1/messageslist']) : this.router.navigate(['/user/1/messagedetails/' + this.GroupID]);
          this.ngOnDestroy();
        }
      }
    })
  }

  getUsertoken() {
    if (this.token !== undefined) {
      return of(this.token)
    } else {
      return this.authservice.getUserToken();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.receiversSubscribtion.unsubscribe();
  }



}
