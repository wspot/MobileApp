import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, of, Observable, forkJoin, EMPTY } from 'rxjs';
import { map, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { EventEmitter } from 'events';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginUrl: string = "User/Login";
  private getUserUrl = "User/GetUser";
  public registerWithReferenceUrl: string = "User/LoginWithReferenceCode";
  private getImageUrl = "Image/GetImageByID";
  //private ServerAddress = "http://192.168.1.102:84/api/";
  //private ServerAddress:string = "http://78.189.143.241:14000/api/";
  private ServerAddress: string = "http://77.75.36.141:84/api/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private userRoles: any[];
  private userPermissions: any;
  private userToken: string;
  private userCloudID: string;
  private deviceID: string;

  public PermissionsUpdated: EventEmitter = new EventEmitter();
  public AuthenticationEvent: EventEmitter = new EventEmitter();

  private UserInfos: any = {
    Name: undefined,
    Surname: undefined,
    Image: undefined,
    ImageID: undefined
  }


  constructor(private storage: Storage, private http: HttpClient, private uniqueDeviceID: UniqueDeviceID, public loadingController: LoadingController) {
    this.initDeviceID();
    this.initCloudID();
    // console.log("State of service  ", this);
  }

  initDeviceID() {
    // console.log(this.deviceID);
    if (this.deviceID == undefined) {
      this.uniqueDeviceID.get()
        .then((uuid: any) => {
          // console.log(uuid);
          this.deviceID = uuid;
          return this.storage.set("deviceID", uuid);
        })
        .then(savingres => { })
        .catch((error: any) => console.log(error));
    }
  }
  initCloudID() {
    if (this.userCloudID == undefined) {
      this.getUserCloudID().subscribe(resolvedCloud => {
        this.userCloudID = (resolvedCloud !== null) ? resolvedCloud : undefined;
      })
    }
  }

  // Return an observable of that emits true or false
  connectUser(username: string, password: string) {
    return forkJoin(this.getUserDeviceID(), this.getUserCloudID(), from(this.storage.get("config")))
      .pipe(
        switchMap(resolvedIDs => {
          let params = { Username: username, Password: password, DeviceID: resolvedIDs[0], CloudID: resolvedIDs[1] };
          if (resolvedIDs[2] !== null) {
            this.ServerAddress = resolvedIDs[2];
          }
          return this.PostData(this.loginUrl, params);
        }),
        map((resp: any) => {
          if (resp.Data !== null) {
            // console.log("auth resp", resp);
            this.setUserCredentials(resp.Data.Token.ReferenceCode, resp.Data.RolList, resp.Data.PermissionList);
            this.AuthenticationEvent.emit("LogInEvent");
            return true;
          } else {
            return { status: false, error: resp.error };
          }
        }),
        catchError(err => { console.log(err.Message); return of(false); })
      )
  }

  registerWithReference(refCode: string) {
    return this.PostData(this.registerWithReferenceUrl, { code: refCode }).pipe(
      switchMap((resolvedCode: any) => {
        // require response validation later
        if (resolvedCode.Data !== null) {
          this.userToken = resolvedCode.Data.Token.ReferenceCode;
          this.storage.set("token", resolvedCode.Data.Token.ReferenceCode)
          return of(true);
        } else {
          return of(false);
        }
      }),
      catchError(err => { console.log(err); return of(false) }),
      switchMap((resp) => { return of(resp) })
    )
  }

  disconnectUser(): Observable<any> {
    this.userToken = undefined;
    this.userRoles = undefined;
    this.userPermissions = undefined;

    this.AuthenticationEvent.emit("LogoutEvent");

    let op1 = this.storage.remove("token");
    let op2 = this.storage.remove("roles");
    let op3 = this.storage.remove("permissions");
    let op4 = this.storage.remove("config");

    return forkJoin([op1, op2, op3, op4]);
  }

  isUserConnected(): Observable<boolean> {
    if (this.userToken !== undefined) {
      return of(true);
    } else {
      let obs = from(this.storage.get("token"));
      return obs.pipe(map(resp => { return !(resp == null) }));
    }
  }

  fetchStorage() {
    this.storage.get("token").then(resp => {
      //  console.log(resp);
    });
  }

  getUserRoles() {
    if (this.userRoles !== undefined) {
      // console.log(this.userRoles)
      return of(this.userRoles);
    } else {
      console.log("fetching storage");
      return from(this.storage.get("roles")).pipe(map(res => {
        return this.convertStringToJsonArray(res)
      }), catchError(err => { console.log(err); return of(null); }));
    }
  }

  getUserRoles2(): Observable<any[]> {
    if (this.userRoles !== undefined) {
      console.log(this.userRoles)
      return of(this.userRoles);
    } else {
      return from(this.storage.get("roles")).pipe(
        map(res => { return this.convertStringToJsonArray(res); }),
        catchError(err => { console.log("err", err); return of([]); })
      )
    }
  }

  getUserPermissions() {
    if (this.userPermissions !== undefined) {
      return of(this.userPermissions);
    } else {
      return from(this.storage.get("permissions")).pipe(
        map(res => { return JSON.parse(res); }),
        catchError(err => { console.log("err", err); return of([]); })
      )
    }
  }

  getUserToken(): Observable<string> {
    if (this.userToken !== undefined) {
      return of(this.userToken);
    } else {
      return from(this.storage.get("token"));
    }
  }
  getUserCloudID(): Observable<string> {
    if (this.userCloudID !== undefined) {
      return of(this.userCloudID);
    } else {
      return from(this.storage.get("firebaseID"));
    }
  }
  getUserDeviceID(): Observable<string> {
    if (this.deviceID !== undefined) {
      return of(this.deviceID);
    } else {
      return from(this.storage.get("deviceID"));
    }
  }


  getUserInfos(): Observable<any> {
    return this.getUserToken().pipe(
      switchMap(resolvedToken => {
        return this.PostDataWithToken(this.getUserUrl, {}, resolvedToken);
      }),
      map((resolvedInfos: any) => {
        // console.log(resolvedInfos)
        this.UserInfos.Name = resolvedInfos.Data.Name;
        this.UserInfos.userSurName = resolvedInfos.Data.Surname;
        return this.UserInfos;
      }),
      catchError(err => { console.log(err); return of(null); })
    )
  }


  getAllUserInfos(userId: any = undefined) {

    let UserChildInfos = {};
    if (userId == undefined) {
      if (this.UserInfos.ImageID !== undefined && this.UserInfos.Name !== undefined) {
        // console.log(this.UserInfos);
        return of(this.UserInfos);
      } else {
        return this.getUserToken().pipe(
          switchMap(resolvedToken => {
            let userObserver$ = (userId !== undefined) ? this.PostDataWithToken(this.getUserUrl, { UserID: +userId }, resolvedToken) : this.PostDataWithToken(this.getUserUrl, {}, resolvedToken);
            return userObserver$;
          }),
          switchMap((resolvedInfos: any) => {
            // console.log("craaaazy 1", resolvedInfos)
            if (resolvedInfos !== null && resolvedInfos.Data !== null) {
              if (userId == undefined) {
                this.UserInfos.Name = resolvedInfos.Data.Name;
                this.UserInfos.Surname = resolvedInfos.Data.Surname;
                this.UserInfos.ImageID = resolvedInfos.Data.ImageID;
              } else {
                console.log("children service")
                UserChildInfos["Name"] = resolvedInfos.Data.Name;
                UserChildInfos["Surname"] = resolvedInfos.Data.Surname;
                UserChildInfos["ImageID"] = resolvedInfos.Data.ImageID;
              }
            }
            let imageObs$;
            if (userId == undefined) {
              imageObs$ = (this.UserInfos.ImageID == 0) ? of(null) : this.PostData(this.getImageUrl, { imageID: this.UserInfos.ImageID });
            } else {
              imageObs$ = (UserChildInfos["ImageID"] == 0) ? of(null) : this.PostData(this.getImageUrl, { imageID: UserChildInfos["ImageID"] });
            }
            return imageObs$;
          }),
          switchMap((resolvedImage: any) => {
            // console.log(resolvedInfos)
            if (userId == undefined) {
              this.UserInfos.Image = (resolvedImage !== null) ? resolvedImage.ImageData : null;
              return of(this.UserInfos);
            } else {
              UserChildInfos["Image"] = (resolvedImage !== null) ? resolvedImage.ImageData : null;
              return of(UserChildInfos);
            }
          })
        );
      }
    } else {
      return this.getUserToken().pipe(
        switchMap(resolvedToken => {
          let userObserver$ = (userId !== undefined) ? this.PostDataWithToken(this.getUserUrl, { UserID: +userId }, resolvedToken) : this.PostDataWithToken(this.getUserUrl, {}, resolvedToken);
          return userObserver$;
        }),
        switchMap((resolvedInfos: any) => {
          // console.log("craaaazy 1", resolvedInfos)
          if (resolvedInfos !== null && resolvedInfos.Data !== null) {
            if (userId == undefined) {
              this.UserInfos.Name = resolvedInfos.Data.Name;
              this.UserInfos.Surname = resolvedInfos.Data.Surname;
              this.UserInfos.ImageID = resolvedInfos.Data.ImageID;
            } else {
              console.log("children service")
              UserChildInfos["Name"] = resolvedInfos.Data.Name;
              UserChildInfos["Surname"] = resolvedInfos.Data.Surname;
              UserChildInfos["ImageID"] = resolvedInfos.Data.ImageID;
            }
          }
          let imageObs$;
          if (userId == undefined) {
            imageObs$ = (this.UserInfos.ImageID == 0) ? of(null) : this.PostData(this.getImageUrl, { imageID: this.UserInfos.ImageID });
          } else {
            imageObs$ = (UserChildInfos["ImageID"] == 0) ? of(null) : this.PostData(this.getImageUrl, { imageID: UserChildInfos["ImageID"] });
          }
          return imageObs$;
        }),
        switchMap((resolvedImage: any) => {
          // console.log(resolvedInfos)
          if (userId == undefined) {
            this.UserInfos.Image = (resolvedImage !== null) ? resolvedImage.ImageData : null;
            return of(this.UserInfos);
          } else {
            UserChildInfos["Image"] = (resolvedImage !== null) ? resolvedImage.ImageData : null;
            return of(UserChildInfos);
          }
        })
      );
    }
  }

  getUserInf(): Observable<any> {
    if (this.UserInfos.ImageID !== undefined && this.UserInfos.Name !== undefined) {
      return of(this.UserInfos);
    } else {
      return this.getUserToken()
        .pipe(
          mergeMap(resolvedToken =>
            forkJoin(
              this.PostDataWithToken(this.getUserUrl, {}, resolvedToken),
              (resolvedInfos: any) => {
                // console.log(resolvedInfos)
                this.UserInfos.Name = resolvedInfos.Data.Name;
                this.UserInfos.Surname = resolvedInfos.Data.Surname;
                this.UserInfos.ImageID = resolvedInfos.Data.ImageID;
              }
            ).pipe(
              mergeMap(res => forkJoin(
                this.PostData(this.getImageUrl, { imageID: this.UserInfos.ImageID }),
                (resolvedImage: any) => {
                  // console.log(resolvedInfos)
                  this.UserInfos.Image = resolvedImage.ImageData;
                  return this.UserInfos;
                }
              )
              )
            )
          ), catchError(err => { console.log(err); return of(null) })
        )
    }
  }

  isUserIzci() {
    return this.getUserRoles().pipe(
      map((resolvedRoles: any) => {
        let isIzci = false;
        resolvedRoles.forEach(role => {
          if (role.RolID == 1) { isIzci = true; }
        });
        return isIzci;
      }), catchError(err => { return EMPTY; })
    )
  }

  isUserLeader() {
    return this.getUserRoles().pipe(
      map((resolvedRoles: any) => {
        // console.log(resolvedRoles);
        let isleader = false;
        resolvedRoles.forEach(role => {
          if (role.RolID == 2) { isleader = true; }
        });
        return isleader;
      }), catchError(err => { console.log("error", err); return of(false); })
    )
  }

  getUserCredentials() {

  }

  setUserCredentials(token: string, roles: any[], permissions: any) {
    if (this.userToken == null || this.userToken !== token) { }

    // let tokenSetterobs$ = (this.userToken == null || this.userToken !== token) ? from(this.storage.set("token", token)) : of(true) ;
    // let rolesSetterobs$ = (this.userToken == null || this.userRoles !== roles) ? from(this.storage.set("roles", this.convertJsonArrayToString(roles))) : of(true) ;
    this.userToken = token;
    this.userRoles = roles;
    this.userPermissions = permissions;
    // store the Token and Roles
    this.storage.set("token", token).then(resolved => {
      this.storage.set("roles", this.convertJsonArrayToString(roles)).then(resolvedResponse => {
        this.storage.set("permissions", JSON.stringify(permissions)).then(resolvedResp => {
          console.log("Storage is Configured");
          this.PermissionsUpdated.emit("permissions");
        }, err => console.log(err));
      }, err => console.log(err));
    }, err => console.log(err));
  }
  setUserCloudID(cloudID: string) {
    if (this.userCloudID == undefined) {
      this.userCloudID = cloudID;
      this.storage.set("firebaseID", cloudID).then(res => { }, err => { });
    } else {
      if (this.userCloudID !== cloudID) {
        this.userCloudID = cloudID;
        this.storage.set("firebaseID", cloudID).then(res => { }, err => { });
      }
    }
  }

  showCredentials() {
    console.log(this.userToken);
    console.log(this.userRoles);
  }

  convertJsonArrayToString(array: any[]) {
    let obj = {};
    array.forEach(function (item, index) {
      obj[index] = JSON.stringify(item);
    });
    return JSON.stringify(obj);
  }

  convertStringToJsonArray(inputString: string) {
    let roles = [];
    if (inputString !== undefined && inputString !== null) {
      let tmp = JSON.parse(inputString);
      Object.keys(tmp).forEach(element => {
        // console.log(JSON.parse(tmp[element]));
        roles.push(JSON.parse(tmp[element]))
      });
    }
    return roles;
  }

  PostData(urlname: string, obj: any) {
    return from(this.loadingController.create({ message: "lütfen bekle", spinner: "lines" })).pipe(
      switchMap(res => {
        return from(res.present());
      }),
      switchMap(() => {
        return this.http.post(this.ServerAddress + urlname, obj, this.httpOptions)
      }),
      map(resolvedData => {
        // loading controller here 
        this.loadingController.dismiss();
        return resolvedData;
      }), catchError(err => {
        // loading controller here
        this.loadingController.dismiss();
        // err.status err.message err.statusText
        if (err.status == 500) {
          // console.log(err.error.Message);
          // this.authService.disconnectUser().subscribe(res => {
          //   this.router.navigate(['/login']);
          // });
        }
        return of({ Data: null, error: err.error.Message });
      })
    );
  }

  PostDataWithToken(urlname: string, obj: any, token: string) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'TIFMobileToken': token
      })
    };
    return from(this.loadingController.create({ message: "lütfen bekle", spinner: "lines" })).pipe(
      switchMap(res => {
        return from(res.present());
      }),
      switchMap(() => {
        return this.http.post(this.ServerAddress + urlname, obj, options)
      }),
      map(resolvedData => {
        // loading controller here 
        this.loadingController.dismiss();
        return resolvedData;
      }), catchError(err => {
        // loading controller here
        this.loadingController.dismiss();
        // err.status err.message err.statusText
        return of(null);
      })
    );
  }

}
