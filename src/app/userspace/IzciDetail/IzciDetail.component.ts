import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { ImagePickerService } from 'src/app/Services/ImagePicker/image-picker.service';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-izcidetails',
  templateUrl: './IzciDetail.component.html',
  styleUrls: ['./IzciDetail.component.scss'],
})
export class IzciDetailComponent implements OnInit {
  public sub: any;
  public kullaniciID: any;
  public getIzciDetails: string = "Izci/GetIzciByID";
  public detailsData: any;
  public profileImage: string;
  public userLoginID: any;

  public userDetailsFields: any[] = [{ fieldName: "Ad", fieldCorrectedName: "Ad" }, { fieldName: "Soyad", fieldCorrectedName: "Soyad" }, { fieldName: "Cinsiyet", fieldCorrectedName: "Cinsiyet" }, { fieldName: "TCKimlikNo", fieldCorrectedName: "TC kimlik no" }, { fieldName: "AnneAdi", fieldCorrectedName: "Anne adı" }, { fieldName: "BabaAdi", fieldCorrectedName: "Baba adı" }, { fieldName: "DogumTarihi", fieldCorrectedName: "Doğum tarihi" }, { fieldName: "DogumYeri", fieldCorrectedName: "Doğum yeri" }, { fieldName: "Email", fieldCorrectedName: "E-mail" }, { fieldName: "Tel", fieldCorrectedName: "telefon" }, { fieldName: "Gsm", fieldCorrectedName: "gsm" }, { fieldName: "EgitimDurumuTipIsim", fieldCorrectedName: "eğitim durumu" }, { fieldName: "LokasyonIsmi", fieldCorrectedName: "lokasyon" }, { fieldName: "KlupIsmi", fieldCorrectedName: "Kulüp adı" }, { fieldName: "UniteIsmi", fieldCorrectedName: "Ünite adı" }, { fieldName: "MedeniHali", fieldCorrectedName: "medeni hali" }, { fieldName: "CocukSayisi", fieldCorrectedName: "çocuk sayısı" }, { fieldName: "IzciTipIsmi", fieldCorrectedName: "izci tipi" }];

  constructor(private route: ActivatedRoute, private router: Router, private storage: Storage, private dataApiservice: DataApiService, private imageService: ImagePickerService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.kullaniciID = params['Kid']; // (+) converts string 'id' to a number
      let param = {
        IzciID: this.kullaniciID
      };
      this.dataApiservice.PostData(this.getIzciDetails, param).subscribe((resolvedDetails: any) => {
        this.detailsData = resolvedDetails.Data.IzciDetailList;
        this.userLoginID = resolvedDetails.Data.UserLoginID;
        this.profileImage = this.imageService.wrapBase64string(resolvedDetails.Data.IzciDetailList.Resim);
      }, err => { console.log(err); })
    });
  }

  onSendMessageToChild() {
    this.authService.getUserInfos().pipe(
      switchMap(resolvedInfos => {
        // console.log(resolvedInfos)
        return from(this.router.navigate(['/user/1/messagesave'], {
          state: {
            receiver: this.detailsData.Ad + ' ' + this.detailsData.Soyad,
            sender: resolvedInfos.Name + ' ' + resolvedInfos.userSurName,
            userloginID: this.userLoginID
          }
        }))
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  navigate(params) {
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

}
