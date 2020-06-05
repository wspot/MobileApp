import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';
import { ImagePickerService } from 'src/app/Services/ImagePicker/image-picker.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-occupations',
  templateUrl: './MissionList.component.html',
  styleUrls: ['./MissionList.component.scss'],
})
export class MissionListComponent implements OnInit {
  public sub: any;
  public userID: any;
  public PageTitle: string = "Uğraşı Listesi";

  public missionsUrl = "Mission/GetMissionList";
  public getUserUrl = "User/GetUser";
  public getImageUrl = "Image/GetImageByID";

  public MissionsData: any[] = [];

  public userName: string;
  public userSurName: string;
  public profileImage: string = "assets/images/defaultimg.jpeg";

  public MissionSearchParams: any = {
    Filter: {}, Paging: { PageNumber: 1, Count: 10 }, Sorting: { ColName: "MissionID", Direction: 0 }
  };

  public token: any;
  public TotalCount: number;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private storage: Storage, private imageService: ImagePickerService) { }

  ngOnInit() {
    console.log("missions init ")
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['Uid'];

      // getting data
      this.storage.get("token").then(resolvedToken => {
        this.token = resolvedToken;
        // setting users Params 
        let userparams = {};
        let userObserver: any;
        // setting  missions Params
        let observer: any;

        if (this.userID == undefined) {
          observer = this.dataApiService.PostDataWithToken(this.missionsUrl, this.MissionSearchParams, this.token);
          userObserver = this.dataApiService.PostDataWithToken(this.getUserUrl, userparams, this.token);
        } else {
          this.MissionSearchParams.Filter = { UserID: +this.userID };
          userparams = { UserID: +this.userID };
          observer = this.dataApiService.PostData(this.missionsUrl, this.MissionSearchParams);
          userObserver = this.dataApiService.PostData(this.getUserUrl, userparams);
        }
        // getting users Data
        userObserver.subscribe((resolvedInformations: any) => {
          this.userName = resolvedInformations.Data.Name;
          this.userSurName = resolvedInformations.Data.Surname;
          let imageSubscriber$ = (resolvedInformations.Data.ImageID !== 0) ? this.dataApiService.PostData(this.getImageUrl, { imageID: resolvedInformations.Data.ImageID }) : of(null);
          imageSubscriber$.subscribe((imageResponse: any) => {
            console.log(imageResponse)
            if (imageResponse !== null) {
              this.profileImage = this.imageService.wrapBase64string(imageResponse.ImageData);
            }
          }, err => { console.log("image error", err); });
        }, err => { console.log(err); });
        // getting Missions Data
        observer.subscribe((resp: any) => {
          this.MissionsData = resp.Data.List;
          this.TotalCount = resp.Data.TotalCount;
        });
      }).catch(err => console.log(err));
    });
  }

  ngOnDestroy() {
    console.log("destroying Missions");
  }

  ionViewDidLeave() {
    console.log("Missions view left");
    this.MissionSearchParams.Paging.PageNumber = 1;
    this.sub.unsubscribe();
  }

  getMissionColor(status) {
    switch (status) {
      case 0:
        return "";
        break;
      case 1:
        return "primary";
        break;
      case 2:
        return "success";
        break;
      case 3:
        return "light";
        break;
    }
  }

  onClickMission(missionID) {
    if (this.userID == undefined) {
      this.navigate('/user/1/activitieslist/' + missionID)
    } else {
      this.navigate('/user/1/activitieslist/' + missionID + '/' + this.userID)
    }
  }

  loadData(event) {
    if (this.MissionsData.length < this.TotalCount) {
      this.MissionSearchParams.Paging.PageNumber++;
      let missionsObs;
      if (this.userID !== undefined) {
        missionsObs = this.dataApiService.PostData(this.missionsUrl, this.MissionSearchParams);
      } else {
        missionsObs = this.dataApiService.PostDataWithToken(this.missionsUrl, this.MissionSearchParams, this.token);
      }
      missionsObs.subscribe(
        (resolvedMissions: any) => {
          if (resolvedMissions !== null) {
            this.MissionsData = this.MissionsData.concat(resolvedMissions.Data.List);
          } else {
            this.MissionSearchParams.Paging.PageNumber--;
          }
          event.target.complete();
        }, err => {
          console.log(err);
          if (this.MissionSearchParams.Paging.PageNumber > 1) {
            this.MissionSearchParams.Paging.PageNumber--;
          }
          event.target.complete();
        }
      )
    } else {
      event.target.complete();
    }
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
