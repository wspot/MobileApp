import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MychildslistComponent } from './mychildslist/mychildslist.component';
import { Top100ListComponent } from './Top100List/Top100List.component';
import { BadgeListComponent } from './BadgeList/BadgeList.component';
import { NotificationListComponent } from './NotificationList/NotificationList.component';
import { MessageListComponent } from './MessageList/MessageList.component';
import { MessageDetailComponent } from './MessageDetail/MessageDetail.component';
import { MissionListComponent } from './MissionList/MissionList.component';
import { IzciListComponent } from './IzciList/IzciList.component';
import { IzciDetailComponent } from './IzciDetail/IzciDetail.component';
import { ActivityListComponent } from './ActivityList/ActivityList.component';
import { ActivityDetailSaveComponent } from './ActivityDetailSave/ActivityDetailSave.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { ProfileSaveComponent } from './ProfileSave/ProfileSave.component';
import { AnnoucementListComponent } from './AnnoucementList/AnnoucementList.component';
import { SharedViewsModule } from '../Shared/shared-views/shared-views.module';
import { AboutUsComponent } from './AboutUs/AboutUs.component';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ImagePickerService } from '../Services/ImagePicker/image-picker.service';
import { UniteListComponent } from './unite-list/unite-list.component';
import { MessageSaveComponent } from './MessageSave/MessageSave.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FilteringComponent } from './filtering/filtering.component';
import { FilterModalComponent } from '../Shared/FiltringModal/filtring-modal.component';
import { SavingLocationComponent } from '../Shared/saving-location/saving-location.component';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SettingsComponent } from './settings/settings.component';
import { SettingModalComponent } from '../Shared/setting-modal/setting-modal.component';



@NgModule({
  declarations: [
    DashboardComponent, ProfileSaveComponent, IzciListComponent, UniteListComponent, IzciDetailComponent,
    BadgeListComponent, MissionListComponent, ActivityListComponent, ActivityDetailSaveComponent,
    MychildslistComponent, MessageListComponent, NotificationListComponent, AnnoucementListComponent,
    Top100ListComponent, AboutUsComponent, MessageDetailComponent, MessageSaveComponent, FilteringComponent, SettingsComponent, FilterModalComponent, SavingLocationComponent, SettingModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedViewsModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileSaveComponent },
      { path: 'izcilist/:UnityId', component: IzciListComponent },
      { path: 'unitelist', component: UniteListComponent },
      { path: 'izcidetails/:Kid', component: IzciDetailComponent },
      { path: 'rozetlist/:Uid', component: BadgeListComponent },
      { path: 'rozetlist', component: BadgeListComponent },
      { path: 'missionslist/:Uid', component: MissionListComponent },
      { path: 'missionslist', component: MissionListComponent },
      { path: 'activitieslist/:Mid/:userID', component: ActivityListComponent },
      { path: 'activitieslist/:Mid', component: ActivityListComponent },
      { path: 'activitydetails/:Aid/:userID', component: ActivityDetailSaveComponent },
      { path: 'activitydetails/:Aid', component: ActivityDetailSaveComponent },
      { path: 'childslist', component: MychildslistComponent },
      { path: 'messageslist', component: MessageListComponent },
      { path: 'notificationslist', component: NotificationListComponent },
      { path: 'annoucementslist', component: AnnoucementListComponent },
      { path: 'toprating', component: Top100ListComponent },
      { path: 'aboutus', component: AboutUsComponent },
      { path: 'messagedetails/:Gid', component: MessageDetailComponent },
      { path: 'messagesave/:Gid', component: MessageSaveComponent },
      { path: 'messagesave', component: MessageSaveComponent },
      { path: 'filter', component: FilteringComponent },
      { path: 'settings', component: SettingsComponent }
    ])
  ],
  providers: [ImagePicker, ImagePickerService, InAppBrowser, Geolocation, AppVersion, LocationAccuracy, PhotoViewer],
  entryComponents: [FilterModalComponent, SavingLocationComponent, SettingModalComponent]
})
export class UserspaceModule { }
