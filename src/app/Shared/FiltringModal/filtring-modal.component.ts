import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filtring-modal.component.html',
  styleUrls: ['./filtring-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {

  public modalTitle: string;
  public Gender: boolean;
  public Filter: any = {
    Gender: undefined,
    IzciTypes: undefined,
    UserRoles: undefined,
    RegisterStartDate: undefined,
    RegisterEndDate: undefined,
    BirthStartDate: undefined,
    BirthEndDate: undefined,
  };


  constructor(public modalController: ModalController, public navParams: NavParams) { }
  public modalTypes: any = {
    organisationModal: { name: "organisation", id: 0 },
    genderModal: { name: "gender", id: 1 },
    izciTypesModal: { name: "izciTypes", id: 2 },
    rolesModal: { name: "roles", id: 3 },
    registrationDateModal: { name: "registrationDate", id: 4 },
    birthdayModal: { name: "birthday", id: 5 }
  }
  public activatedModalID: number;

  ngOnInit() {
    let params = this.navParams.get("params");
    this.Filter = Object.assign({}, this.Filter, params.Filter);
    // console.log(this.Filter);
    switch (params.modalType) {
      case this.modalTypes.organisationModal.name:
        this.modalTitle = "Organizations";
        this.activatedModalID = this.modalTypes.organisationModal.id;
        break;
      case this.modalTypes.genderModal.name:
        this.modalTitle = "Gender";
        this.activatedModalID = this.modalTypes.genderModal.id;
        break;
      case this.modalTypes.izciTypesModal.name:
        this.modalTitle = "Izci Types";
        this.activatedModalID = this.modalTypes.izciTypesModal.id;
        break;
      case this.modalTypes.rolesModal.name:
        this.modalTitle = "Roles";
        this.activatedModalID = this.modalTypes.rolesModal.id;
        break;
      case this.modalTypes.registrationDateModal.name:
        this.modalTitle = "Registration Date";
        this.activatedModalID = this.modalTypes.registrationDateModal.id;
        break;
      case this.modalTypes.birthdayModal.name:
        this.modalTitle = "Birthday";
        this.activatedModalID = this.modalTypes.birthdayModal.id;
        break;
    }
  }

  onCancelModal() {
    this.modalController.dismiss({}, "cancel")
  }


  onConfirmFilter() {
    switch (this.activatedModalID) {
      case this.modalTypes.organisationModal.id:
        this.modalController.dismiss({}, "cancel");
        break;
      case this.modalTypes.genderModal.id:
        this.modalController.dismiss({ Gender: this.Filter.Gender }, "confirm");
        break;
      case this.modalTypes.izciTypesModal.id:
        this.modalController.dismiss({ IzciTypes: this.Filter.IzciTypes }, "confirm");
        break;
      case this.modalTypes.rolesModal.id:
        this.modalController.dismiss({ UserRoles: this.Filter.UserRoles }, "confirm");
        break;
      case this.modalTypes.registrationDateModal.id:
        this.modalController.dismiss({ RegisterStartDate: this.Filter.RegisterStartDate, RegisterEndDate: this.Filter.RegisterEndDate }, "confirm");
        break;
      case this.modalTypes.birthdayModal.id:
        this.modalController.dismiss({ BirthStartDate: this.Filter.BirthStartDate, BirthEndDate: this.Filter.BirthEndDate }, "confirm");
        break;
    }
  }
}
