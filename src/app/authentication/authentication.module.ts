import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/Register.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgetPasswordComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: LoginComponent },
      { path: 'register/:type', component: RegisterComponent },
      { path: 'forgetpass', component: ForgetPasswordComponent },
      { path: 'changepass/:type', component: ChangePasswordComponent }
    ])
  ],
  providers: [],
})
export class AuthenticationModule { }
