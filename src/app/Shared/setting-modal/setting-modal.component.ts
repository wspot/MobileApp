import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.scss'],
})
export class SettingModalComponent implements OnInit {
  public ipAddress: string;
  constructor(public modalController: ModalController, private dataApi: DataApiService) { }

  ngOnInit() { }

  onCancelModal() {
    this.modalController.dismiss({}, "cancel")
  }

  onSave() {
    console.log(this.ipAddress)
    if (this.ipAddress == "") {
      this.dataApi.presentErrorToast("Please enter a correct ip address");
    } else {
      this.modalController.dismiss({ ipAddress: this.ipAddress }, "save")
    }
  }

}
