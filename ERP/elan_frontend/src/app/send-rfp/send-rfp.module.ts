import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendRfpRoutingModule } from './send-rfp-routing.module';
import { SendRfpComponent } from './send-rfp.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionDialogAnswerComponent } from './question-dialog-answer/question-dialog-answer.component';
import { ShippingAlertModule } from '../@modules/purchase-management/shipping-alert/shipping-alert.module';


@NgModule({
  declarations: [
    SendRfpComponent,
    QuestionDialogAnswerComponent
  ],
  imports: [
    CommonModule,
    SendRfpRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ShippingAlertModule
  ]
})
export class SendRfpModule { }
