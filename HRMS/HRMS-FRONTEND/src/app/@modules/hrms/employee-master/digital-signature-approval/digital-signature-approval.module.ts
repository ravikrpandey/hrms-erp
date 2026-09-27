import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { DigitalSignatureApprovalRoutingModule } from './digital-signature-approval-routing.module';
import { DigitalSignatureApprovalComponent } from './digital-signature-approval.component';
import { DigitalSignatureApprovalActionComponent } from './digital-signature-approval-action/digital-signature-approval-action.component';
import { SignatureApprovalDialogComponent } from './signature-approval-dialog/signature-approval-dialog.component';


@NgModule({
  declarations: [
    DigitalSignatureApprovalComponent,
    DigitalSignatureApprovalActionComponent,
    SignatureApprovalDialogComponent
  ],
  imports: [
    CommonModule,
    DigitalSignatureApprovalRoutingModule,
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
export class DigitalSignatureApprovalModule { }
