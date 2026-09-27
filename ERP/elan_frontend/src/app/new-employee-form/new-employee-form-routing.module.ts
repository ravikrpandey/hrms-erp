import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEmployeeFormComponent } from './new-employee-form.component';
import { EmployeeDatailsComponent } from './employee-datails/employee-datails.component';
import { DocumentDetailsFormComponent } from './document-details-form/document-details-form.component';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { PreviousEmploymentDetailsComponent } from './previous-employment-details/previous-employment-details.component';
import { PaymentDetailFormComponent } from './payment-detail-form/payment-detail-form.component';


const routes: Routes = [
  {
    path: '', component: NewEmployeeFormComponent,
    children: [
      {
        path: 'employee-details-form', redirectTo: 'employee-details-form', pathMatch: 'full'
      },
      {
        path: 'employee-details-form', component: EmployeeDatailsComponent
  
      },
      {
        path: 'personal-details-form', component: PersonalDetailsFormComponent
      },
    
      {
        path: 'previous-details-form', component: PreviousEmploymentDetailsComponent
      },
      {
        path: 'payment-details-form', component: PaymentDetailFormComponent
      },
      {
        path: 'document-details-form', component: DocumentDetailsFormComponent
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    EmployeeDatailsComponent
  ],
})
export class NewEmployeeFormRoutingModule { }
