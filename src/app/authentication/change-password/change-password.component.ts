import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  public ChangePasswordUrl: string = "User/ChangePassword";
  public ChangeForgetedPassUrl: string = "???";
  public ControlTokenUrl: string = "User/ControlTokenForgetPassword";
  public sub: any;
  public pageType: string;
  public userToken: string;

  public oldPassword: string = '';
  public newPassword: string = '';
  public newPasswordAgain: string = '';

  public oldPasswordError: boolean = false;
  public newPasswordError: boolean = false;
  public newPasswordAgainError: boolean = false;

  constructor(private dataApiservice: DataApiService, private authservice: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.pageType = (params['type'] !== undefined && params['type'] == 'forgeted') ? 'forgeted' : 'normalchange';
      console.log(this.pageType)
    });

    this.authservice.getUserToken().subscribe(resolvedToken => {
      this.userToken = resolvedToken;
      console.log(this.userToken);
    })
  }

  goBack() {
    if (this.pageType == 'forgeted') {
      this.navigate('/login');
    } else {
      this.navigate('/user/1/profile')
    }
  }

  onCredentialsChange() {
    this.oldPasswordError = this.oldPassword.trim() == '';
    this.newPasswordError = this.newPassword.trim() == '';
    this.newPasswordAgainError = this.newPasswordAgain.trim() == '';
  }

  areInputsValid(): boolean {
    if (this.oldPassword.trim() == '' || this.newPassword.trim() == '' || this.newPasswordAgain.trim() == '') {
      return false;
    }
    return true;
  }

  onChangePassword() {
    if (!this.areInputsValid()) {
      this.onCredentialsChange();
    } else {
      let item = {};
      if (this.pageType == 'normalchange') {
        item['OldPassword'] = this.oldPassword;
        item['NewPassword'] = this.newPassword;
        item['NewPasswordAgain'] = this.newPasswordAgain;
      } else {

      }
      let changePassObs$ = (this.pageType == 'forgeted') ? this.dataApiservice.PostData(this.ChangeForgetedPassUrl, {}) : this.dataApiservice.PostDataWithToken(this.ChangePasswordUrl, item, this.userToken);

      changePassObs$.pipe(
        map(resolvedResponse => {
          if (resolvedResponse.Data) {
            this.goBack();
          }
        }),
        catchError(err => {
          console.log(err);
          return of(EMPTY);
        })
      ).subscribe();
    }
  }



  navigate(params) {
    this.router.navigate([params]);
  }

}
