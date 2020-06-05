import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerUrl: string = "User/Register";
  public registerWithReferenceUrl: string = "User/LoginWithReferenceCode";
  public sub: any;
  public pageName: any;
  public pageTitle: string;

  public kimlikno: number;
  public name: string = "";
  public surname: string = "";
  public mothername: string = "";
  public fathername: string = "";
  // private phone: any;
  // private email: any;
  public birthdate: any;
  public referans: any;
  public referansError: boolean = false;

  public kimlikError: boolean = false;
  public nameError: boolean = false;
  public surnameError: boolean = false;
  public mothernameError: boolean = false;
  public fathernameError: boolean = false;
  public birthdateError: boolean = false;

  public showSpinner: boolean = false;
  public wrongCredentials: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private dataApiservice: DataApiService, private storage: Storage, private authService: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.pageName = params['type'];
      this.pageTitle = this.pageName == 'veli' ? 'Veli Kayit Forumu' : 'İzci Kayıt Formu';
    });

    // this.kimlikno = 56917449814 ;
    // this.name = "RAMAZAN" ;
    // this.surname = "KARTAL" ;
    // this.mothername = "HATİCE" ; 
    // this.fathername = "MUSTAFA" ;
    // this.birthdate = "1965-02-17";
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
  onRegister() {
    // console.log(params);
    this.showSpinner = true;
    if (this.name == "" || this.surname == "" || this.kimlikno == undefined || this.fathername == "" || this.mothername == "" || this.birthdate == undefined) {
      this.showSpinner = false;
      this.onIzciCredentialsChange();
    } else if (this.kimlikno.toString().length !== 11) {
      this.showSpinner = false;
      this.wrongCredentials = true;
    } else {
      this.showSpinner = true;
      this.wrongCredentials = false;

      let params = {
        Name: this.name,
        Surname: this.surname,
        TCKimlikNo: this.kimlikno.toString(),
        FatherName: this.fathername,
        MotherName: this.mothername,
        BirthDate: this.birthdate.split('T')[0]
      };
      this.dataApiservice.PostData(this.registerUrl, params).subscribe((resp: any) => {
        this.showSpinner = false;
        if (resp.Data !== null) {
          this.wrongCredentials = false;
          this.storage.set("token", resp.Data.Token.ReferenceCode).then((response: any) => {
            if (resp.Data.IsExistMobilUser) {
              this.navigate('/user/1');
            } else {
              this.storage.set("UserValues", JSON.stringify(params)).then((res: any) => {
                // this.navigate('/user/1/profile');
                this.router.navigate(['/user/1/profile'], { state: { page: 'register', mode: "Izci" } });
              }, (err: any) => { console.log(err); });
            }
          }, (error) => {
            this.showSpinner = false;
            console.log(error);
          });
        }
        else {
          this.wrongCredentials = true;
        }
      });
    }
  }
  onIzciCredentialsChange() {
    this.kimlikError = this.kimlikno == undefined;
    this.nameError = this.name.trim() == "";
    this.surnameError = this.surname.trim() == "";
    this.mothernameError = this.mothername.trim() == "";
    this.fathernameError = this.fathername.trim() == "";
    this.birthdateError = this.birthdate == undefined;
    this.wrongCredentials = false;
  }

  onVeliCredentialsChange() {
    this.referansError = this.referans == undefined || this.referans == "";
  }

  resetIzciView() {
    this.kimlikError = false;
    this.nameError = false;
    this.surnameError = false;
    this.mothernameError = false;
    this.fathernameError = false;
    this.birthdateError = false;
    this.wrongCredentials = false;
    this.kimlikno = undefined;
    this.name = "";
    this.surname = "";
    this.mothername = "";
    this.fathername = "";
    this.birthdate = undefined;
  }

  onRegisterWithReference() {
    this.showSpinner = true;
    if (this.referans == undefined || this.referans == "") {
      this.showSpinner = false;
      this.onVeliCredentialsChange();
    } else {
      this.authService.registerWithReference(this.referans).subscribe(resolvedResp => {
        // console.log(resolvedResp);
        if (resolvedResp) {
          // console.log(resolvedResp);
          this.showSpinner = false;
          this.router.navigate(['/user/1/profile'], { state: { page: 'register', mode: "Veli" } });
        } else {
          this.showSpinner = false;
        }
      })
    }
  }
  onRegisterWithReferenceOld() {
    this.showSpinner = true;
    if (this.referans == undefined || this.referans == "") {
      this.showSpinner = false;
    } else {
      let params = {
        code: this.referans
      };
      this.dataApiservice.PostData(this.registerWithReferenceUrl, params).subscribe(value => {
        this.showSpinner = false;
        console.log(value);
      }, err => {
        this.showSpinner = false;
        console.log(err);
      })
    }
  }

}
