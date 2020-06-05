import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './Services/Authentication/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // private associateTokenUrl: string = "User/FirebaseAssoc";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private storage: Storage,
    private authService: AuthenticationService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initFcmOperations();
    });
  }

  initFcmOperations() {
    //  this.storage.forEach((val, key) => { console.log(val, key); });
    this.fcm.getToken()
      .then(resolvedCloudID => {
        this.authService.setUserCloudID(resolvedCloudID);
      }, err => { })

    // Refreshing Fcm Token
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("token is refreshed ", token);
      this.storage.set("firebaseID", token).then(resp => {
      }, err => { console.log(err) });
    });

    // Handling Fcm notifications
    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
    });
  }

}
