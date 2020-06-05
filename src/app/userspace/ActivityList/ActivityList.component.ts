import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';
import { ImagePickerService } from 'src/app/Services/ImagePicker/image-picker.service';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-activities',
  templateUrl: './ActivityList.component.html',
  styleUrls: ['./ActivityList.component.scss'],
})
export class ActivityListComponent implements OnInit {
  public activitiesUrl: string = "Mission/GetActivityList";
  public getUserUrl = "User/GetUser";
  public getImageUrl = "Image/GetImageByID";

  public PageTitle: string = "Uğraşı Maddesi Listesi";
  public sub: any;
  public userID: any;
  public missionID: any = undefined;
  public token: string;

  public userName: string;
  public userSurName: string;

  public ActivitiesData: any[] = [];
  public profileImage: string = "assets/images/defaultimg.jpeg";
  public defaultImage: string = "assets/images/defaultimg.jpeg";
  public SearchParams: any = {
    Filter: {},
    Paging: { PageNumber: 1, Count: 10 },
    Sorting: { ColName: "ActivityID", Direction: 0 }
  };
  public TotalCount: number;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private storage: Storage, private imageService: ImagePickerService, private authenticationservice: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      // (+) converts string 'id' to a number
      this.userID = params['userID'];
      this.missionID = params['Mid'];
      if (this.userID == undefined) {
        this.storage.get("token").then((resolvedToken: any) => {
          this.token = resolvedToken;
          // getting the users informations 
          this.authenticationservice.getAllUserInfos().pipe(
            map((resolvedInformations: any) => {
              this.userName = resolvedInformations.Name;
              this.userSurName = resolvedInformations.Surname;
              if (resolvedInformations.Image !== null) {
                this.profileImage = this.imageService.wrapBase64string(resolvedInformations.Image);
              }
            })
          ).subscribe();

          // getting the activity list
          this.SearchParams.Filter.missionID = this.missionID;
          this.dataApiService.PostDataWithToken(this.activitiesUrl, this.SearchParams, this.token).subscribe((response: any) => {
            this.ActivitiesData = (response !== null) ? response.Data.List : undefined;
            this.TotalCount = (response !== null) ? response.Data.TotalCount : 0;
          }, err => { console.log(err) });
        }).catch(err => console.log(err));
      } else {
        this.authenticationservice.getAllUserInfos(this.userID).pipe(

          switchMap((resolvedInformations: any) => {
            console.log(resolvedInformations)
            this.userName = resolvedInformations.Name;
            this.userSurName = resolvedInformations.Surname;
            if (resolvedInformations.Image !== null) {
              this.profileImage = this.imageService.wrapBase64string(resolvedInformations.Image);
            } else {
              this.profileImage = this.defaultImage;
            }
            return this.authenticationservice.getUserToken();
          }),
          map((resolvedToken: string) => {
            this.token = resolvedToken;
          }),
          switchMap(() => {
            // getting the activity list
            // console.log("searching activities")
            this.SearchParams.Filter = { missionID: this.missionID, UserID: this.userID };
            return this.dataApiService.PostDataWithToken(this.activitiesUrl, this.SearchParams, this.token);
          }),
          catchError(err => { console.log("theeere is err", err); return of(null) })
        ).subscribe(res => {
          // console.log(res);
          this.ActivitiesData = (res !== null) ? res.Data.List : undefined;
        })
      }
    });
  }

  ionViewDidLeave() {
    console.log("Activities view left");
    this.SearchParams.Paging.PageNumber = 1;
    this.sub.unsubscribe();
  }
  loadData(event) {
    if (this.ActivitiesData.length < this.TotalCount) {
      this.SearchParams.Paging.PageNumber++;
      this.dataApiService.PostDataWithToken(this.activitiesUrl, this.SearchParams, this.token).subscribe(
        (resolvedActivities: any) => {
          this.ActivitiesData = (resolvedActivities !== null) ? this.ActivitiesData.concat(resolvedActivities.Data.List) : this.ActivitiesData;
          if (resolvedActivities == null) {
            this.SearchParams.Paging.PageNumber--;
          }
          event.target.complete();
        }, err => {
          if (this.SearchParams.Paging.PageNumber > 1) {
            this.SearchParams.Paging.PageNumber--;
          }
          event.target.complete();
        }
      )
    } else {
      event.target.complete();
    }
  }
  getActivityColor(activityType: number) {
    if (activityType == 0) {
      return "light";
    } else if (activityType == 1) {
      return "warning";
    } else if (activityType == 2) {
      return "success";
    } else {
      return "danger";
    }
  }
  onClickActivity(activityID) {
    (this.userID !== undefined) ? this.navigate('/user/1/activitydetails/' + activityID + '/' + this.userID) : this.navigate('/user/1/activitydetails/' + activityID);
  }
  ngOnDestroy() {
    console.log("Destroying Activities")
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
