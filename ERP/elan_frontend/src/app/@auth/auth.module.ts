import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from '../@shared/material/material.module';
import { ShowHidePasswordDirective } from '../@shared/directives/show-hide-password.directive';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SsoComponent } from './sso/sso.component';


@NgModule({
  declarations: [
    LoginComponent,
    ShowHidePasswordDirective,
    VendorLoginComponent,
    ForgotPasswordComponent,
    SsoComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule,
    MaterialModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
