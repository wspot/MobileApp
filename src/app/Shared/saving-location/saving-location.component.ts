import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';



@Component({
  selector: 'app-saving-location',
  templateUrl: './saving-location.component.html',
  styleUrls: ['./saving-location.component.scss'],
})
export class SavingLocationComponent implements OnInit {
  public longitude: number;
  public latitude: number;
  public accuracy: number;
  public loadingMode: boolean = true;
  private subscribtion: any;
  constructor(public modalController: ModalController, public geolocation: Geolocation, private locationAccuracy: LocationAccuracy) { }

  ngOnInit() {
    this.subscribtion = from(this.locationAccuracy.canRequest()).pipe(
      switchMap((resolvedResp: boolean) => {
        // the accuracy option will be ignored by iOS
        return from(this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY));
      }),
      switchMap((resolvedResp) => {
        return from(this.geolocation.getCurrentPosition({ enableHighAccuracy: true }));
      }),
      map(resolvedPosition => {
        this.longitude = resolvedPosition.coords.longitude;
        this.latitude = resolvedPosition.coords.latitude;
        this.accuracy = resolvedPosition.coords.accuracy;
        this.loadingMode = false;
      }),
      catchError(err => {
        console.log(err);
        this.onCancelModal();
        return of(null);
      })
    ).subscribe();
  }

  initlocation() {
    this.locationAccuracy.canRequest().then((resolvedResp: boolean) => {
      console.log(resolvedResp);
      if (resolvedResp) {
        // the accuracy option will be ignored by iOS
        return this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      }
    }).then(resolvedResp => {
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(resp => {
        console.log("location :", resp);
        this.longitude = resp.coords.longitude;
        this.latitude = resp.coords.latitude;
        this.accuracy = resp.coords.accuracy;
        this.loadingMode = false;
      }).catch(err => { console.log(err); })
    }).catch(err => { console.log(err); })
  }

  onCancelModal() {
    this.modalController.dismiss()
  }

  onSave() {
    this.modalController.dismiss({ location: { longitude: this.longitude, latitude: this.latitude, accuracy: this.accuracy } });
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

}
