import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';

import { ImagePickerService } from 'src/app/Services/ImagePicker/image-picker.service';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Location } from '@angular/common'
import { SavingLocationComponent } from 'src/app/Shared/saving-location/saving-location.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';



@Component({
  selector: 'app-activitydetails',
  templateUrl: './ActivityDetailSave.component.html',
  styleUrls: ['./ActivityDetailSave.component.scss'],
})
export class ActivityDetailSaveComponent implements OnInit {
  public getActivityByIdUrl: string = "Mission/GetActivityByID";
  public getImageUrl: string = "Image/GetImageByID";
  public saveImageUrl: string = "Image/Save";
  public saveActivityUrl: string = "Mission/SaveUserActivity";
  public getUserUrl: string = "User/GetUser";
  public changeActivityStatusUrl: string = "Mission/ChangeStatuActivity";

  public sub: any;
  public activityID: any;
  public userActivityID: any;
  public userID: any;
  public DetailsData: any;

  public userDescription: string = "";
  public token: string = "";


  public image1: any = {
    id: undefined,
    binary: undefined,
    profile: "assets/images/default.jpg"
  };
  public image2: any = {
    id: undefined,
    binary: undefined,
    profile: "assets/images/default.jpg"
  };
  public image3: any = {
    id: undefined,
    binary: undefined,
    profile: "assets/images/default.jpg"
  };

  public userName: string;
  public userSurName: string;
  public profileImage: string;

  public longitude: number;
  public latitude: number;
  public accuracy: number;

  public activityImages: any[] = [];
  public defaultImage: string = "assets/images/defaultimg.jpeg";


  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private dataApiService: DataApiService, private imageService: ImagePickerService, private storage: Storage, private authService: AuthenticationService, private geolocation: Geolocation, private location: Location, private modalController: ModalController, private iab: InAppBrowser, private photoViewer: PhotoViewer) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.activityID = params['Aid'];
      this.userID = params['userID'];

      this.authService.getUserToken().subscribe(resolvedToken => {
        this.token = resolvedToken;
        if (this.userID == undefined) {
          // getting user's informations
          this.authService.getAllUserInfos().subscribe(resultInfos => {
            // console.log("craaaazy", resultInfos)
            if (resultInfos !== null) {
              // console.log(resultInfos)
              this.userName = resultInfos.Name;
              this.userSurName = resultInfos.Surname;
              if (resultInfos.Image !== null) {
                this.profileImage = this.imageService.wrapBase64string(resultInfos.Image);
              } else {
                this.profileImage = this.defaultImage;
              }
            }
            this.initializeActivityData();
          });
        } else {
          // console.log("user is child");
          this.authService.getAllUserInfos(this.userID).pipe(
            map((resolvedInformations: any) => {
              this.userName = resolvedInformations.Name;
              this.userSurName = resolvedInformations.Surname;
              if (resolvedInformations.Image !== null) {
                this.profileImage = this.imageService.wrapBase64string(resolvedInformations.Image);
              } else {
                this.profileImage = this.defaultImage;
              }
              this.initializeActivityData();
            }),
            catchError(err => { return of(null) })
          ).subscribe(res => { /* console.log(res); */ })
        }
      }, err => { console.log(err); })
    }, err => { console.log(err); });
  }


  initializeActivityData() {
    let params = { ActivityID: this.activityID };
    if (this.userID !== undefined) {
      params["UserLoginID"] = this.userID;
    }
    // console.log(this.token);
    this.dataApiService.PostDataWithToken(this.getActivityByIdUrl, params, this.token).pipe(
      switchMap((res: any) => {
        this.DetailsData = res.Data;
        this.userDescription = this.DetailsData.UserDescription;
        this.userActivityID = res.Data.UserActivityID;
        this.longitude = res.Data.Longitude;
        this.latitude = res.Data.Latitude;
        this.accuracy = res.Data.Accuracy;

        // this.image1.id = res.Data.Image1ID;
        // this.image2.id = res.Data.Image2ID;
        // this.image3.id = res.Data.Image3ID;

        this.activityImages.push({ id: res.Data.Image1ID });
        this.activityImages.push({ id: res.Data.Image2ID });
        this.activityImages.push({ id: res.Data.Image3ID });


        let image1obs$ = (res.Data.Image1ID !== null) ? this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image1ID }) : of(null);
        let image2obs$ = (res.Data.Image2ID !== null) ? this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image2ID }) : of(null);
        let image3obs$ = (res.Data.Image3ID !== null) ? this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image3ID }) : of(null);

        return forkJoin([image1obs$, image2obs$, image3obs$]);
      })
      , catchError(err => { return of(null) })).subscribe(resolvedImages => {
        // console.log(resolvedImages);
        if (resolvedImages !== null) {
          // this.image1.profile = resolvedImages[0] ? this.imageService.wrapBase64string(resolvedImages[0].ImageData) : this.image1.profile;
          // this.image2.profile = resolvedImages[1] ? this.imageService.wrapBase64string(resolvedImages[1].ImageData) : this.image2.profile;
          // this.image3.profile = resolvedImages[2] ? this.imageService.wrapBase64string(resolvedImages[2].ImageData) : this.image3.profile;

          this.activityImages[0].profile = resolvedImages[0] ? this.imageService.wrapBase64string(resolvedImages[0].ImageData) : undefined;
          this.activityImages[1].profile = resolvedImages[1] ? this.imageService.wrapBase64string(resolvedImages[1].ImageData) : undefined;
          this.activityImages[2].profile = resolvedImages[2] ? this.imageService.wrapBase64string(resolvedImages[2].ImageData) : undefined;

          let i = 0;
          while (i < this.activityImages.length) {
            if (this.activityImages[i].profile == undefined) {
              this.activityImages.splice(i, 1);
            } else {
              i++;
            }
          }
        } else {
          // we should do something for the error page
        }
      });
  }
  async onAddImage() {

    let options = {
      maximumImagesCount: 1,
      outputType: 1,
      quality: 20
    }
    await this.imageService.openImagePicker(options).then((resolvedImages: any) => {
      if (resolvedImages.length > 0) {
        // console.log(resolvedImages[0].length);
        let image = {
          id: -1,
          profile: this.imageService.wrapBase64string(resolvedImages[0]),
          binary: this.imageService.convertBase64ToByteArray(resolvedImages[0])
        }
        this.activityImages.push(image);
      }
    })
  }
  onDeleteImage(index) {
    this.activityImages.splice(index, 1);
  }
  disableAddImage() {
    return (!this.DetailsData.CanSave || (this.activityImages.length >= 3));
  }

  async onShowImage(index) {
    this.photoViewer.show(this.activityImages[index].profile)
  }

  async onAddLocation() {
    const modal = await this.modalController.create({
      component: SavingLocationComponent
    });
    await modal.present();
    modal.onDidDismiss().then((modalResponse: any) => {
      if (modalResponse.data !== undefined) {
        this.longitude = modalResponse.data.location.longitude;
        this.latitude = modalResponse.data.location.latitude;
        this.accuracy = modalResponse.data.location.accuracy;
      }
    }, err => { console.log(err); });
  }

  onDeleteLocation() {
    this.longitude = null;
    this.latitude = null;
    this.accuracy = null;
  }
  disableAddLocation() {
    return (!this.DetailsData.CanSave || !(this.longitude == null || undefined) || !(this.latitude == null || undefined))
  }

  onOpenLocation() {
    let url = "http://www.google.com/maps/place/" + this.latitude + "," + this.longitude;
    const browser = this.iab.create(url);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleMenu() {
    this.menu.toggle();
  }

  navigate(params) {
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

  onChangeActivityStatus(status: boolean) {
    let params = {
      activityID: this.activityID,
      userID: this.userID,
      state: status
    }
    this.dataApiService.PostDataWithToken(this.changeActivityStatusUrl, params, this.token).subscribe(res => {
      if (this.userID !== undefined) {
        this.navigate('/user/1/activitieslist/' + this.DetailsData.MissionID + "/" + this.userID);
      } else {
        this.navigate('/user/1/activitieslist/' + this.DetailsData.MissionID)
      }
      // this.navigate('/user/1/activitieslist/' + this.DetailsData.MissionID+"/"+this.userID)
      // this.location.back();
    }, err => { })
  }

  disableSaveActivity() {
    if (this.DetailsData !== undefined) {
      if (!this.DetailsData.hasLocation && !this.DetailsData.hasImage && !this.DetailsData.hasDescription) {
        return true;
      } else {
        if (this.isImagesInputCorrect() && this.isLocationInputCorrect()) {
          return (this.DetailsData.ActivityTypeTag == "Done");
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  isLocationInputCorrect(): boolean {
    if (this.DetailsData.hasLocation) {
      return (this.accuracy !== null && this.longitude !== null && this.latitude !== null);
    } else {
      return true;
    }
  }

  isImagesInputCorrect(): boolean {
    if (this.DetailsData.hasImage) {
      return (this.activityImages.length == 3);
    } else {
      return true;
    }
  }

  // new  saving method
  onSaveActivity() {
    let imagesObserver$ = of(null);

    if (this.DetailsData.hasImage) {
      let savingparams1 = {
        FileName: "Random",
        // Content: this.image1.binary,
        Content: this.activityImages[0].binary,
        ImageDataID: 0
      }
      let savingparams2 = {
        FileName: "Random",
        // Content: this.image2.binary,
        Content: this.activityImages[0].binary,
        ImageDataID: 0
      }
      let savingparams3 = {
        FileName: "Random",
        // Content: this.image3.binary,
        Content: this.activityImages[0].binary,
        ImageDataID: 0
      }
      let image1obs$ = (this.activityImages[0].id == -1) ? this.dataApiService.PostData(this.saveImageUrl, savingparams1) : of(null);
      let image2obs$ = (this.activityImages[1].id == -1) ? this.dataApiService.PostData(this.saveImageUrl, savingparams2) : of(null);
      let image3obs$ = (this.activityImages[2].id == -1) ? this.dataApiService.PostData(this.saveImageUrl, savingparams3) : of(null);
      imagesObserver$ = forkJoin([image1obs$, image2obs$, image3obs$]);
    }
    imagesObserver$.pipe(
      switchMap(resolvedImages => {
        let params = {
          ActivityID: parseInt(this.activityID),
          UserActivityID: this.userActivityID,
          Description: this.userDescription,
          Video: ""
        };

        if (resolvedImages !== null) {
          this.activityImages[0].id = (resolvedImages[0] !== null && resolvedImages[0].Data !== null) ? resolvedImages[0].Data : this.activityImages[0].id;
          this.activityImages[1].id = (resolvedImages[1] !== null && resolvedImages[1].Data !== null) ? resolvedImages[1].Data : this.activityImages[1].id;
          this.activityImages[2].id = (resolvedImages[2] !== null && resolvedImages[2].Data !== null) ? resolvedImages[2].Data : this.activityImages[2].id;
          params["Image1"] = { ImageDataID: this.activityImages[0].id };
          params["Image2"] = { ImageDataID: this.activityImages[1].id };
          params["Image3"] = { ImageDataID: this.activityImages[2].id };
        }
        if (this.DetailsData.hasLocation) {
          params["Latitude"] = this.latitude;
          params["Longitude"] = this.longitude;
          params["Accuracy"] = this.accuracy;
        }
        return this.dataApiService.PostDataWithToken(this.saveActivityUrl, params, this.token);
      }),
      catchError(err => { return of(null) })
    )
      .subscribe(resp => {
        if (resp == null) {
        } else {
          if (this.userID == undefined) {
            this.navigate('/user/1/activitieslist/' + this.DetailsData.MissionID);
          } else {
            this.navigate('/user/1/activitieslist/' + this.DetailsData.MissionID + "/" + this.userID)
          }
        }
      }
      )
  }

  // this is not used : remove later
  initActivityData() {
    // getting users images
    let params = { activityID: this.activityID };
    if (this.userID !== undefined) {
      params["UserLoginID"] = this.userID;
    }
    this.dataApiService.PostData(this.getActivityByIdUrl, params).subscribe((res: any) => {
      this.DetailsData = res.Data;
      this.userActivityID = res.Data.UserActivityID;

      if (res.Data.Image1ID !== null) {
        this.image1.id = res.Data.Image1ID;
        this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image1ID }).subscribe((imageResponse: any) => {
          this.image1.profile = this.imageService.wrapBase64string(imageResponse.ImageData);
        }, err => { console.log(err); });
      }
      if (res.Data.Image2ID !== null) {
        this.image2.id = res.Data.Image2ID;
        this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image2ID }).subscribe((imageResponse: any) => {
          this.image2.profile = this.imageService.wrapBase64string(imageResponse.ImageData);
        }, err => { console.log(err); });
      }
      if (res.Data.Image3ID !== null) {
        this.image3.id = res.Data.Image3ID;
        this.dataApiService.PostData(this.getImageUrl, { imageID: res.Data.Image3ID }).subscribe((imageResponse: any) => {
          this.image3.profile = this.imageService.wrapBase64string(imageResponse.ImageData);
        }, err => { console.log(err); });
      }
    }, err => { console.log(err); })
  }

  onChooseImage(imagenumber: number) {
    if ((this.DetailsData.ActivityTypeTag == "Undone" || this.DetailsData.ActivityTypeTag == "Rejected") && this.DetailsData.CanSave) {
      this.imageService.openImagePicker().then((resolvedImages: any) => {
        if (resolvedImages.length > 0) {
          switch (imagenumber) {
            case 1: {
              this.image1.id = -1;
              this.image1.profile = this.imageService.wrapBase64string(resolvedImages[0]);
              this.image1.binary = this.imageService.convertBase64ToByteArray(resolvedImages[0]);
              break;
            }
            case 2: {
              this.image2.id = -1;
              this.image2.profile = this.imageService.wrapBase64string(resolvedImages[0]);
              this.image2.binary = this.imageService.convertBase64ToByteArray(resolvedImages[0]);
              break;
            }
            case 3: {
              this.image3.id = -1;
              this.image3.profile = this.imageService.wrapBase64string(resolvedImages[0]);
              this.image3.binary = this.imageService.convertBase64ToByteArray(resolvedImages[0]);
              break;
            }
          }
        }
      }, err => { console.log(err); })
    }
  }
  onAcceptActivity() {
    // let savingparams1 = {
    //   FileName: "Random",
    //   Content: this.image1.binary,
    //   ImageDataID: 0
    // }
    // let savingparams2 = {
    //   FileName: "Random",
    //   Content: this.image2.binary,
    //   ImageDataID: 0
    // }
    // let savingparams3 = {
    //   FileName: "Random",
    //   Content: this.image3.binary,
    //   ImageDataID: 0
    // }

    // if (this.image1.id == -1 && this.image2.id == -1 && this.image3.id == -1) {

    //   this.dataApiService.PostData(this.saveImageUrl, savingparams1).subscribe((resolvedImage1: any) => {
    //     this.image1.id = resolvedImage1.Data;

    //     this.dataApiService.PostData(this.saveImageUrl, savingparams2).subscribe((resolvedImage2: any) => {
    //       this.image2.id = resolvedImage2.Data;

    //       this.dataApiService.PostData(this.saveImageUrl, savingparams3).subscribe((resolvedImage3: any) => {
    //         this.image3.id = resolvedImage3.Data;
    //         this.geolocation.getCurrentPosition().then(resolvedPosition => {

    //           let params = {
    //             ActivityID: parseInt(this.activityID),
    //             Latitude: resolvedPosition.coords.latitude,
    //             Longitude: resolvedPosition.coords.longitude,
    //             Accuracy: resolvedPosition.coords.accuracy,
    //             Description: this.userDescription,
    //             Image1: { ImageDataID: this.image1.id },
    //             Image2: { ImageDataID: this.image2.id },
    //             Image3: { ImageDataID: this.image3.id }
    //           };
    //           this.authService.getUserToken().subscribe((resolvedToken: any) => {
    //             this.dataApiService.PostDataWithToken(this.changeActivityStatusUrl, params, resolvedToken).subscribe(resolvedResponse => {
    //             }, err => { console.log(err); });
    //           })
    //         }, err => { console.log(err); });
    //       }, err => { console.log(err); })
    //     }, err => { console.log(err); });
    //   }, err => { console.log(err); });
    // }
  }

}



