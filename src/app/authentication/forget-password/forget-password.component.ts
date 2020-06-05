import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/Services/DataApi/data-api.service';
import { map, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {

  public sendTokenToEmailUrl: string = "User/ForgetPasswordConfirmation";
  public emailIsSent: boolean = false;
  public userInput: string = "";
  public userInputError: boolean = true;

  constructor(private dataApiservice: DataApiService, private router: Router) { }

  ionViewDidEnter() {
    this.emailIsSent = false;
  }

  navigate(params) {
    this.router.navigate([params]);
  }

  onEmailChange() {
    this.userInputError = this.userInput.trim() == "";
  }

  onSendPasswordToEmail() {
    if (this.isInputValid()) {
      this.dataApiservice.PostData(this.sendTokenToEmailUrl, { emailOrUsername: this.userInput }).pipe(
        map(resolvedResp => {
          if (resolvedResp) {
            console.log(resolvedResp);
            this.emailIsSent = true;
          }
        }),
        catchError(err => {
          console.log(err);
          return of(EMPTY)
        })
      ).subscribe();
    }
  }

  isInputValid() {
    if (this.userInput) {
      if (this.userInput.length > 2) {
        return true;
      }
      return false;
    }
    return false;
  }

}
