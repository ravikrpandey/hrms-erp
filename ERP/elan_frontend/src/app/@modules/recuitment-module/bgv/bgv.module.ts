import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgvRoutingModule } from './bgv-routing.module';
import { BgvListComponent } from './bgv-list/bgv-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BgvActionComponent } from './bgv-action/bgv-action.component';
import { ReadyForBgvComponent } from './ready-for-bgv/ready-for-bgv.component';
import { BgvSendOnMailComponent } from './bgv-send-on-mail/bgv-send-on-mail.component';
import { BgvSendOnMailActionComponent } from './bgv-send-on-mail-action/bgv-send-on-mail-action.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ViewCompanyRemarksComponent } from './view-company-remarks/view-company-remarks.component';

@NgModule({
  declarations: [
    BgvListComponent,
    BgvActionComponent,
    ReadyForBgvComponent,
    BgvSendOnMailComponent,
    BgvSendOnMailActionComponent,
    ViewCompanyRemarksComponent
  ],
  imports: [
    CommonModule,
    BgvRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule,
    CKEditorModule
  ],
})
export class BgvModule { }
