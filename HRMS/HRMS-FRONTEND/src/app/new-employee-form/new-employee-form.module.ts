import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewEmployeeFormRoutingModule } from './new-employee-form-routing.module';
import { NewEmployeeFormComponent } from './new-employee-form.component';
import { EmployeeDatailsComponent } from './employee-datails/employee-datails.component';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { PreviousEmploymentDetailsComponent } from './previous-employment-details/previous-employment-details.component';
import { DocumentDetailsFormComponent } from './document-details-form/document-details-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../@shared/material/material.module';
import { PaymentDetailFormComponent } from './payment-detail-form/payment-detail-form.component';
import { MatSelectFilterModule } from 'mat-select-filter';



@NgModule({
  declarations: [
    NewEmployeeFormComponent,
    EmployeeDatailsComponent,
    PersonalDetailsFormComponent,
    PreviousEmploymentDetailsComponent,
    DocumentDetailsFormComponent,
    PaymentDetailFormComponent
  ],
  imports: [
    CommonModule,
    NewEmployeeFormRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatSelectFilterModule
  ]
})
export class NewEmployeeFormModule { }
