import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateProfileRoutingModule } from './candidate-profile-routing.module';
import { CandidateProfileComponent } from '../candidate-profile/candidate-profile.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateActionComponent } from './candidate-action/candidate-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { VendorProfileRequestComponent } from './vendor-profile-request/vendor-profile-request.component';
import { AddProfileVendorComponent } from './add-profile-vendor/add-profile-vendor.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ActionComponent } from './vendor-profile-request/action/action.component';


@NgModule({
  declarations: [
    CandidateProfileComponent,
    CandidateActionComponent,
    VendorProfileRequestComponent,
    AddProfileVendorComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    CandidateProfileRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxIntlTelInputModule
  ]
})
export class CandidateProfileModule { }
