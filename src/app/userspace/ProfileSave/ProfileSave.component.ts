import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DataApiService } from "src/app/Services/DataApi/data-api.service";
import { ImagePickerService } from "src/app/Services/ImagePicker/image-picker.service";
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { from, EMPTY, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: "app-profile",
  templateUrl: "./ProfileSave.component.html",
  styleUrls: ["./ProfileSave.component.scss"]
})
export class ProfileSaveComponent implements OnInit {
  public PageTitle: string = "Profil güncelleme";

  public getUserUrl = "User/GetUser"; public updateUserUrl = "User/UpdateProfile";

  public getImageUrl = "Image/GetImageByID"; public saveImageUrl = "Image/Save";
  public showLoadingBar: boolean = true;

  public token: string; public previousValues: any;

  public username: string; public password: string; public passwordAgain: string; public name: string; public surname: string; public email: string; public phone: string; public imageID: number; public UserID: number;

  public TCKimlikNo: number; public FatherName: string; public MotherName: string; public BirthDate: any;

  public profileImage: string = "assets/images/defaultimg.jpeg";
  public imageArray: any = [];
  public updateErrorMessage: string = "";

  public initSubscribtion: any;
  public sourcePage: any;
  public sourcemode: any;

  public disableNameAndSurname: boolean = true;

  public userExists: boolean = false;

  public usernameError: boolean = false; public nameError: boolean = false; public passwordError: boolean = false; public passwordAgainError: boolean = false; public surnameError: boolean = false; public emailError: boolean = false; public phoneError: boolean = false; public kimlikError: boolean = false;




  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private storage: Storage, private dataApiservice: DataApiService, private imageService: ImagePickerService, private authservice: AuthenticationService) { }

  ngOnInit() {
    console.log(this.router.getCurrentNavigation());
    if (this.router.getCurrentNavigation().extras['state'] !== undefined) {
      this.sourcePage = this.router.getCurrentNavigation().extras.state.page;
      this.sourcemode = this.router.getCurrentNavigation().extras.state.mode;
      this.userExists = (this.sourcePage !== "register");
    } else {
      this.userExists = true;
    }
    this.initSubscribtion = from(this.storage.get("token")).pipe(
      switchMap(resolvedToken => {
        // console.log(resolvedToken);
        this.token = resolvedToken;
        return from(this.storage.get("UserValues"));
      }),
      switchMap((resp: any) => {
        this.previousValues = resp;
        if (resp !== null) {
          return this.setNewUserValues(resp);
        } else {
          if (this.userExists) {
            return this.setExistingUserValues();
          } else {
            this.disableNameAndSurname = false;
          }
        }
      }),
      catchError(err => { console.log(err); return of(err) })
    ).subscribe();
  }

  ngOnDestroy() {
    this.initSubscribtion.unsubscribe();
  }

  setNewUserValues(resp: any) {
    let previousUserInput = JSON.parse(resp);
    this.showLoadingBar = false;
    this.name = previousUserInput.Name;
    this.surname = previousUserInput.Surname;
    this.TCKimlikNo = previousUserInput.TCKimlikNo;
    this.FatherName = previousUserInput.FatherName;
    this.MotherName = previousUserInput.MotherName;
    this.BirthDate = previousUserInput.BirthDate;
    this.showLoadingBar = false;
    this.imageID = undefined;
    return from(this.storage.remove("UserValues"));
  }

  setExistingUserValues() {
    return this.dataApiservice.PostDataWithToken(this.getUserUrl, {}, this.token).pipe(
      switchMap((resp: any) => {
        if (resp !== null) {
          this.username = resp.Data.UserName;
          this.password = resp.Data.Password;
          this.name = resp.Data.Name;
          this.surname = resp.Data.Surname;
          this.email = resp.Data.EMail;
          this.phone = resp.Data.PhoneNumber;
          this.TCKimlikNo = resp.Data.TCNo;
          this.FatherName = resp.Data.FatherName;
          this.MotherName = resp.Data.MotherName;
          this.BirthDate = resp.Data.BirthDate;
          this.imageID = resp.Data.ImageID;
          let imageObserver = (this.imageID !== 0) ? this.dataApiservice.PostData(this.getImageUrl, { imageID: this.imageID }) : of(null);
          return imageObserver;
        } else {
          this.showLoadingBar = false;
          this.disableNameAndSurname = false;
          return of(null);
        }
      }),
      map((imageResponse: any) => {
        // render image
        if (imageResponse !== null) {
          this.showLoadingBar = false;
          this.profileImage = this.imageService.wrapBase64string(imageResponse.ImageData);
          this.showLoadingBar = false;
        }
      }),
      catchError(err => { console.log(err); this.showLoadingBar = false; return of(EMPTY); })
    );
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
  onChangeImage() {
    this.imageID = undefined;
    this.imageService.openImagePicker().then(
      results => {
        if (results.length > 0) {
          this.profileImage = this.imageService.wrapBase64string(results[0]);
          this.imageArray = this.imageService.convertBase64ToByteArray(results[0]);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onClickUpdate() {
    if (this.userExists) {
      let params = {
        Username: this.username,
        Password: this.password,
        Name: this.name,
        Surname: this.surname,
        Phone: this.phone,
        EMail: this.email,
        ImageDataID: this.imageID,
        TCKimlikNo: this.TCKimlikNo,
        FatherName: this.FatherName,
        MotherName: this.MotherName,
        BirthDate: this.BirthDate
      };
      var savingparams = {
        FileName: "Random",
        Content: this.imageArray,
        ImageDataID: 0
      };
      this.showLoadingBar = true;

      if (this.imageID == undefined && this.profileImage !== "assets/images/default.jpg") {
        this.dataApiservice.PostDataWithToken(this.saveImageUrl, savingparams, this.token).subscribe(
          (resolvedResponse: any) => {
            this.imageID = resolvedResponse.Data;
            params.ImageDataID = resolvedResponse.Data;
            this.dataApiservice.PostDataWithToken(this.updateUserUrl, params, this.token).subscribe(
              (response: any) => {
                this.showLoadingBar = false;
                if (response.Data !== null) {
                  this.updateErrorMessage = "";
                  // console.log(this.sourcePage);
                  if (this.sourcePage == 'register') {
                    this.authservice.disconnectUser().subscribe(() => {
                      this.navigate("/");
                    })
                  } else {
                    this.navigate("/user/1");
                  }
                } else {
                  this.updateErrorMessage = "Güncelleme başarısız oldu";
                }
              },
              err => {
                console.log(err);
                this.showLoadingBar = false;
              }
            );
          },
          err => {
            console.log(err);
            this.showLoadingBar = false;
          }
        );
      } else {
        this.dataApiservice.PostDataWithToken(this.updateUserUrl, params, this.token).subscribe(
          (response: any) => {
            this.showLoadingBar = false;
            if (response.Data !== null) {
              this.updateErrorMessage = "";
              this.storage.set("token", response.Data.Token.ReferenceCode).then(
                (res: any) => {
                  if (this.sourcePage == 'register') {
                    this.authservice.disconnectUser().subscribe(() => {
                      this.navigate("/");
                    })
                  } else {
                    this.navigate("/user/1");
                  }
                },
                err => {
                  console.log(err);
                  this.showLoadingBar = false;
                }
              );
            } else {
              this.updateErrorMessage = "Güncelleme başarısız oldu";
            }
          },
          err => {
            console.log(err);
            this.showLoadingBar = false;
          }
        );
      }
      // console.log( params );
    } else {
      if (!this.passwordError && !this.passwordAgainError && (this.password == this.passwordAgain)) {
        let params = {
          Username: this.username,
          Password: this.password,
          Name: this.name,
          Surname: this.surname,
          Phone: this.phone,
          EMail: this.email,
          ImageDataID: this.imageID,
          TCKimlikNo: this.TCKimlikNo,
          FatherName: this.FatherName,
          MotherName: this.MotherName,
          BirthDate: this.BirthDate
        };
        var savingparams = {
          FileName: "Random",
          Content: this.imageArray,
          ImageDataID: 0
        };
        this.showLoadingBar = true;

        if (this.imageID == undefined && this.profileImage !== "assets/images/default.jpg") {
          this.dataApiservice.PostDataWithToken(this.saveImageUrl, savingparams, this.token).subscribe(
            (resolvedResponse: any) => {
              this.imageID = resolvedResponse.Data;
              params.ImageDataID = resolvedResponse.Data;
              this.dataApiservice.PostDataWithToken(this.updateUserUrl, params, this.token).subscribe(
                (response: any) => {
                  this.showLoadingBar = false;
                  if (response.Data !== null) {
                    this.updateErrorMessage = "";
                    // console.log(this.sourcePage);
                    if (this.sourcePage == 'register') {
                      this.authservice.disconnectUser().subscribe(() => {
                        this.navigate("/");
                      })
                    } else {
                      this.navigate("/user/1");
                    }
                  } else {
                    this.updateErrorMessage = "Güncelleme başarısız oldu";
                  }
                },
                err => {
                  console.log(err);
                  this.showLoadingBar = false;
                }
              );
            },
            err => {
              console.log(err);
              this.showLoadingBar = false;
            }
          );
        } else {
          this.dataApiservice.PostDataWithToken(this.updateUserUrl, params, this.token).subscribe(
            (response: any) => {
              this.showLoadingBar = false;
              if (response.Data !== null) {
                this.updateErrorMessage = "";
                this.storage.set("token", response.Data.Token.ReferenceCode).then(
                  (res: any) => {
                    if (this.sourcePage == 'register') {
                      this.authservice.disconnectUser().subscribe(() => {
                        this.navigate("/");
                      })
                    } else {
                      this.navigate("/user/1");
                    }
                  },
                  err => {
                    console.log(err);
                    this.showLoadingBar = false;
                  }
                );
              } else {
                this.updateErrorMessage = "Güncelleme başarısız oldu";
              }
            },
            err => {
              console.log(err);
              this.showLoadingBar = false;
            }
          );
        }
      } else {
        this.dataApiservice.presentErrorToast("şifreniz doğru değil");
      }
    }
  }

  onInputsChange() {
    this.usernameError = (this.username !== undefined && this.username.trim() == "");
    this.nameError = (this.name !== undefined && this.name.trim() == "");
    this.surnameError = (this.surname !== undefined && this.surname.trim() == "");
    this.emailError = (this.email !== undefined && this.email.trim() == "");
    this.phoneError = (this.phone !== undefined && this.phone.trim() == "");
    this.passwordError = (this.password !== undefined && this.password.trim() == "");
    this.passwordAgainError = (this.passwordAgain !== undefined && this.passwordAgain.trim() == "");
    this.kimlikError = (this.TCKimlikNo == undefined);
    // console.log(this.TCKimlikNo)
  }
}
