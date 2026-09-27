import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpDigitalSignatureRoutingModule } from './emp-digital-signature-routing.module';
import { EmpDigitalSignatureComponent } from './emp-digital-signature.component';

import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateDigitalSignatureComponent } from './create-digital-signature/create-digital-signature.component';
import { EmpDigitalActionComponent } from './emp-digital-action/emp-digital-action.component';
import { SignatureApproverRemarkDialogComponent } from './signature-approver-remark-dialog/signature-approver-remark-dialog.component';

@NgModule({
  declarations: [
    EmpDigitalSignatureComponent,
    CreateDigitalSignatureComponent,
    EmpDigitalActionComponent,
    SignatureApproverRemarkDialogComponent
  ],
  imports: [
    CommonModule,
    EmpDigitalSignatureRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatNativeDateModule,
    MatExpansionModule,
    AgGridModule,
    MaterialModule,
    NgxMatSelectSearchModule, 
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule


  ]
})
export class EmpDigitalSignatureModule { }
