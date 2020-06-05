import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { SettingModalComponent } from 'src/app/Shared/setting-modal/setting-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public PageTitle: string = "AYARLAR";
  public username: string;
  public password: string;
  public loggedIn: boolean = false;
  public selectedConfig: string;
  public testApi: string = "http://78.189.143.241:14000/api/";
  public realApi: string = "http://77.75.36.141:84/api/";
  public possibleConfigurations: any[] = [
    { name: "TestConfig", value: "78.189.143.241:14000", label: "http://78.189.143.241:14000/api/" },
    { name: "RealConfig", value: "77.75.36.141:84", label: "http://77.75.36.141:84/api/" },
  ];
  constructor(private dataApiservice: DataApiService, private router: Router, public modalController: ModalController) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    // console.log("config init")
    this.loggedIn = false;
    this.username = undefined;
    this.password = undefined;
    let apiconfig = this.dataApiservice.getCurrentConfig();

    this.selectedConfig = (apiconfig.split("//")[1]).split("/")[0];
    if (apiconfig !== this.testApi && apiconfig !== this.realApi) {
      this.possibleConfigurations.push({ name: "NewConfig", value: this.selectedConfig, label: apiconfig })
    }
    console.log(this.selectedConfig);
  }

  onLogin() {
    // console.log(this.username, this.password);
    if (this.username == "a" && this.password == "a") {
      this.loggedIn = true;
    } else {
      this.dataApiservice.presentErrorToast("wrong credentials");
      this.loggedIn = false;
    }
  }

  onChangeConfig() {
    // let $obs = (this.selectedConfig == "RealConfig") ? this.dataApiservice.switchToRealSystem() : this.dataApiservice.switchToTestSystem();
    // $obs.pipe(map(
    //   resolvedponse => {
    //     // console.log(resolvedponse);
    //     if (resolvedponse.response) {
    //       this.loggedIn = false;
    //       this.router.navigate(['/home']);
    //     } else {
    //       this.dataApiservice.presentErrorToast("the operations Failed");
    //     }
    //   }
    // )).subscribe();
    this.dataApiservice.switchToNewConfig(this.selectedConfig).pipe(
      map(
        resolvedponse => {
          // console.log(resolvedponse);
          if (resolvedponse.response) {
            this.loggedIn = false;
            this.router.navigate(['/home']);
          } else {
            this.dataApiservice.presentErrorToast("the operations Failed");
          }
        }
      )
    ).subscribe();
    console.log(this.selectedConfig);
  }

  async onAddNewConfig() {
    const modal = await this.modalController.create({
      component: SettingModalComponent,
      componentProps: {
        params: {}
      }
    });
    await modal.present();
    modal.onDidDismiss().then(res => {
      if (res.role == "save") {
        this.possibleConfigurations.push({ name: "NewConfig", value: res.data.ipAddress, laber: "http://" + res.data.ipAddress + "/api/" })
      }
    });
  }

}
