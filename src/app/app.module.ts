import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SideMenuComponent } from './Shared/side-menu/side-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { FCM } from '@ionic-native/fcm/ngx';
import { DataApiService } from './Services/DataApi/data-api.service';
import { AuthenticationService } from './Services/Authentication/authentication.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { LoadingSpinnerService } from './Services/LoadingSpinner/loading-spinner.service';

@NgModule({
  declarations: [AppComponent, SideMenuComponent],
  exports: [SideMenuComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    UniqueDeviceID,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataApiService, AuthenticationService, LoadingSpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
