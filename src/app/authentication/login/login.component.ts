import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginUrl = "User/Login";
  public associateTokenUrl: string = "User/FirebaseAssoc";
  public userHasToken: boolean = false;
  public wrongCredentials: boolean = false;
  public showSpinner: boolean = false;
  public username: string = "";
  public password: string = "";
  public errorMessage: string = "";
  public userNameError: boolean = false;
  public passwordError: boolean = false;

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {


  }

  navigate(params) {
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

  onCredentialsChange() {
    this.userNameError = this.username.trim() == "";
    this.passwordError = this.password.trim() == "";
    this.wrongCredentials = false;
  }

  onPasswordChange() {

    this.wrongCredentials = false;
  }

  onConnet() {
    if (this.username == "" || this.password == "") {
      this.userNameError = this.username.trim() == "";
      this.passwordError = this.password.trim() == "";
    }
    else {
      this.showSpinner = true;
      this.wrongCredentials = false;
      this.authService.connectUser(this.username, this.password).subscribe((resp: any) => {
        // console.log(resp);
        if (resp == true) {
          // console.log(resp);
          // this.authService.setUserCredentials(resp.Data.Token.ReferenceCode, resp.Data.RolList);
          this.wrongCredentials = false;
          this.showSpinner = false;
          this.navigate('/user/1');
        }
        else {
          this.errorMessage = resp.error;
          this.wrongCredentials = true;
          this.showSpinner = false;
        }
      }, err => { console.log(err) })
    }
  }
}
