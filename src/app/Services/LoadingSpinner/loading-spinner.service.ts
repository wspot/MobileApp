import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private loadingOverlay: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController) {
    if (this.loadingOverlay == undefined) {
      this.loadingController.create({ message: "lütfen bekle", spinner: "lines" }).then(res => {
        this.loadingOverlay = res;
      })
    }
  }

  presentOverlay() {
    let loadingObs$ = (this.loadingOverlay !== undefined) ? of(this.loadingOverlay) : from(this.loadingController.create({ message: "lütfen bekle", spinner: "lines" }));
    return loadingObs$.pipe(
      switchMap(res => {
        this.loadingOverlay = res;
        // console.log(this.loadingOverlay)
        return from(res.present());
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    )
  }
  dismissOverlay() {
    return from(this.loadingOverlay.dismiss()).pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }
}
