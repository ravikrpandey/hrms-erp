import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTabs } from './all-tabs/all-tabs';
import { DeductionCreateComponent } from 'src/app/@modules/payroll/salary/deductions/deduction-create/deduction-create.component';
import { DeductionChargeCreate } from './deduction-charge-create/deduction-charge-create';
import { ExemptionsSection } from './exemptions-section/exemptions-section';
import { OtherSection } from './other-section/other-section';
import { ItStatement } from './it-statement/it-statement';
import { Submission } from './submission/submission';

const routes: Routes = [
  {path: '',  component: AllTabs,
    children:[
      {
        path:'deduction-form',component:DeductionChargeCreate
      },
      {
        path:'exemptions',component:ExemptionsSection
      },
      {
        path:'other-section',component:OtherSection
      },
      {
        path:'it-statement',component:ItStatement
      },
      {
        path:'submission',component:Submission
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTabsRoutingModule { }
