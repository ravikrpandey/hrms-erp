import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  {
    path: 'employee-create', component: EmployeeCreateComponent,
    children: [
      {
        path: '', redirectTo: 'basic-details', pathMatch: 'full'
      },
      {
        path: 'basic-details', component: BasicDetailsComponent

      },
      {
        path: 'personal-details', component: PersonalDetailsComponent
      },
      {
        path: 'salary-details', component: SalaryDetailsComponent
      },
      {
        path: 'payment-details', component: PaymentDetailsComponent
      },
      {
        path: 'document-details', component: DocumentDetailsComponent
      },
      {
        path: 'contract-details', component: ContractDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeListRoutingModule { }
