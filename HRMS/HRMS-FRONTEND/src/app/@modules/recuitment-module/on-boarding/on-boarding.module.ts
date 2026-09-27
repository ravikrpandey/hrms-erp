import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnBoardingRoutingModule } from './on-boarding-routing.module';
import { OnBoardingComponent } from './on-boarding.component';
import { MailDialogComponent } from './mail-dialog/mail-dialog.component';
import { OnBoardingActionComponent } from './on-boarding-action/on-boarding-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { OfferFormComponent } from './offer-form/offer-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EmailSendeComponent } from './email-sende/email-sende.component';


@NgModule({
  declarations: [
    OnBoardingComponent,
    MailDialogComponent,
    OnBoardingActionComponent,
    OfferFormComponent,
    PrintDialogComponent,
    EmailSendeComponent
  ],
  imports: [
    CommonModule,
    OnBoardingRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule ,
    ReactiveFormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})

export class OnBoardingModule { }
