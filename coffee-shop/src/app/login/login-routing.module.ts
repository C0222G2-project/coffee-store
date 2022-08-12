import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeLoginComponent} from './home-login/home-login.component';
import {ForgotPasswordLoginComponent} from './forgot-password-login/forgot-password-login.component';
import {ChangePasswordLoginComponent} from './change-password-login/change-password-login.component';
import {Error403PageComponent} from "./error403-page/error403-page.component";


const routes: Routes = [
  {
    path: 'login',
    component: HomeLoginComponent
  },
  {
    path: 'forgot',
    component: ForgotPasswordLoginComponent
  },
  {
    path: 'change',
    component: ChangePasswordLoginComponent
  },
  {
    path: 'error403',
    component: Error403PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
