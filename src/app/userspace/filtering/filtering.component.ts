import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from 'src/app/Shared/FiltringModal/filtring-modal.component';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { Router, RouteReuseStrategy } from '@angular/router';

@Component({
  selector: 'app-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss'],
})
export class FilteringComponent implements OnInit {
  public sub: any;
  public userID: any;
  public PageTitle: string = "Filtering";
  public Filter: any = {
    Gender: undefined,
    IzciTypes: undefined,
    UserRoles: undefined,
    RegisterStartDate: undefined,
    RegisterEndDate: undefined,
    BirthStartDate: undefined,
    BirthEndDate: undefined,
  };

  public modalTypes: any = {
    organisationModal: { name: "organisation", id: 0 },
    genderModal: { name: "gender", id: 1 },
    izciTypesModal: { name: "izciTypes", id: 2 },
    rolesModal: { name: "roles", id: 3 },
    registrationDateModal: { name: "registrationDate", id: 4 },
    birthdayModal: { name: "birthday", id: 5 }
  }
  public isleader: boolean;

  constructor(public modalController: ModalController, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.authService.isUserLeader().subscribe(resp => {
      // console.log(resp);
      this.isleader = resp;
    }, err => {
      console.log(err);
      this.isleader = false;
    })
  }

  getItemColor(modalName) {
    switch (modalName) {
      case this.modalTypes.organisationModal.name:
        return "";

      case this.modalTypes.genderModal.name:
        return (this.Filter.Gender !== undefined) ? "light" : "";

      case this.modalTypes.izciTypesModal.name:
        return (this.Filter.IzciTypes !== undefined) ? "light" : "";

      case this.modalTypes.rolesModal.name:
        return (this.Filter.UserRoles !== undefined) ? "light" : "";

      case this.modalTypes.registrationDateModal.name:
        return (this.Filter.RegisterStartDate !== undefined || this.Filter.RegisterEndDate) ? "light" : "";

      case this.modalTypes.birthdayModal.name:
        return (this.Filter.BirthStartDate !== undefined || this.Filter.BirthEndDate) ? "light" : "";

      default:
        return "";
    }
  }
  onResetFilters() {
    this.Filter = {
      Gender: undefined,
      IzciTypes: undefined,
      UserRoles: undefined,
      RegisterStartDate: undefined,
      RegisterEndDate: undefined,
      BirthStartDate: undefined,
      BirthEndDate: undefined,
    };
  }


  async  onOpenFiltersModal(modalName) {
    // console.log(this.Filter);
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        params: {
          modalType: modalName,
          Filter: this.Filter
        }
      }
    });
    await modal.present();
    modal.onDidDismiss().then(res => {
      console.log(res)
      if (res.role !== "cancel") {
        switch (modalName) {
          case this.modalTypes.organisationModal.name:
            break;
          case this.modalTypes.genderModal.name:
            this.Filter.Gender = res.data.Gender;
            break;
          case this.modalTypes.izciTypesModal.name:
            this.Filter.IzciTypes = res.data.IzciTypes;
            break;
          case this.modalTypes.rolesModal.name:
            this.Filter.UserRoles = res.data.UserRoles;
            break;
          case this.modalTypes.registrationDateModal.name:
            this.Filter.RegisterStartDate = res.data.RegisterStartDate;
            this.Filter.RegisterEndDate = res.data.RegisterEndDate;
            break;
          case this.modalTypes.birthdayModal.name:
            this.Filter.BirthStartDate = res.data.BirthStartDate;
            this.Filter.BirthEndDate = res.data.BirthEndDate;
            break;
        }
      }
    });
  }

  onSendFilters() {
    this.router.navigate(['user/1/toprating'], { state: { Filter: this.Filter } });
  }

}