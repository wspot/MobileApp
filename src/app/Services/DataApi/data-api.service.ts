import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { of, EMPTY, from, fromEvent, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage'
import { AuthenticationService } from '../Authentication/authentication.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { LoadingSpinnerService } from '../LoadingSpinner/loading-spinner.service';

class ApiConfigResponse {
  response: boolean;
  api: string;
  constructor(_resp: boolean, _api: string) {
    this.api = _api;
    this.response = _resp;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  public testApi: string = "http://78.189.143.241:14000/api/";
  public realApi: string = "http://77.75.36.141:84/api/";

  //private ServerAddress = "http://192.168.1.102:84/api/";
  // public ServerAddress : string = "http://78.189.143.241:14000/api/";
  public ServerAddress: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient, private router: Router, private storage: Storage, private authService: AuthenticationService, public toastController: ToastController, public loadingController: LoadingController, private loadingspinner: LoadingSpinnerService) {
    this.storage.get("config").then(resp => {
      if (resp !== null) {
        this.ServerAddress = resp;
      } else {
        this.ServerAddress = this.realApi;
      }
      console.log(" data api service :", resp);
    }, err => { console.log(err); this.ServerAddress = this.realApi; });
    fromEvent(this.authService.AuthenticationEvent, "LogoutEvent").subscribe(resolvedEvent => {
      this.ServerAddress = this.realApi;
    })
  }

  switchToNewConfig(ApiAddress: string) {
    let api = "http://" + ApiAddress + "/api/";
    return from(this.storage.set("config", api)).pipe(
      switchMap(resp => {
        this.ServerAddress = api;
        return of(new ApiConfigResponse(true, api));
      }),
      catchError(err => { return of(new ApiConfigResponse(false, this.ServerAddress)); })
    );
  }

  switchToRealSystem() {
    return from(this.storage.set("config", this.realApi)).pipe(
      switchMap(resp => {
        this.ServerAddress = this.realApi;
        return of(new ApiConfigResponse(true, this.realApi));
      }),
      catchError(err => { return of(new ApiConfigResponse(false, this.ServerAddress)); })
    );
  }
  switchToTestSystem() {
    return from(this.storage.set("config", this.testApi)).pipe(
      switchMap(resp => {
        this.ServerAddress = this.testApi;
        return of(new ApiConfigResponse(true, this.testApi));
      }),
      catchError(err => { return of(new ApiConfigResponse(false, this.ServerAddress)); })
    );
  }

  getCurrentConfig(): string {
    return this.ServerAddress;
  }

  CallService(urlname: string, params: HttpParams) {
    return this.http.get(this.ServerAddress + urlname, { params });
  }
  CallServiceByUri(urlname: string, params: string) {
    return this.http.get(this.ServerAddress + urlname + params);
  }
  GetData(urlname: string) {
    return this.http.get(this.ServerAddress + urlname);
  }

  PostData(urlname: string, obj: any) {
    // console.log("post enter")
    return this.loadingspinner.presentOverlay().pipe(
      mergeMap(() => {
        return this.http.post(this.ServerAddress + urlname, obj, this.httpOptions)
      }),
      mergeMap((resolvedData: any) => {
        return forkJoin(this.loadingspinner.dismissOverlay(), of(resolvedData));
      }),
      map((resolvedResp: any) => {
        // console.log("post finished", resolvedResp)
        this.presentSuccesToast(resolvedResp.Message);
        return resolvedResp[1];
      }),
      catchError(err => {
        // console.log("post error", err);
        // err.status err.message err.statusText
        this.presentErrorToast(err.error.Message);
        return forkJoin(this.loadingspinner.dismissOverlay(), of(null));
      })
    );

    //{ Data: null, error: err.error.Message }
  }

  PostDataWithToken(urlname: string, obj: any, token: string) {
    // console.log("post token enter");
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'TIFMobileToken': token
      })
    };

    return this.loadingspinner.presentOverlay().pipe(
      mergeMap(() => {
        return this.http.post(this.ServerAddress + urlname, obj, options)
      }),
      mergeMap((resolvedData: any) => {
        return forkJoin(this.loadingspinner.dismissOverlay(), of(resolvedData));
      }),
      map((resolvedResp: any) => {
        // console.log("post token finished", resolvedResp)
        this.presentSuccesToast(resolvedResp.Message);
        return resolvedResp[1];
      }),
      catchError(err => {
        console.log("post token error", err);
        // err.status err.error.Message  err.statusText
        if (err.status == 500) {
          // console.log(err);
          this.presentErrorToast(err.error.Message);
          // this.authService.disconnectUser().subscribe(res => {
          //   this.router.navigate(['/login']);
          // });
        }
        return forkJoin(this.loadingspinner.dismissOverlay(), of(null));
      })
    );
  }

  PostDataByUri(urlname: string, params: HttpParams) {
    return this.http.post(this.ServerAddress + urlname, params);
  }

  async presentErrorToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage,
      color: "danger",
      duration: 3000,
      showCloseButton: true
    });
    toast.present();
  }

  async presentSuccesToast(successMessage) {
    const toast = await this.toastController.create({
      message: successMessage,
      color: "success",
      duration: 3000,
      showCloseButton: true
    });
    toast.present();
  }



}
