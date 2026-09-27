import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowComponent } from './work-flow.component';

const routes: Routes = [
  {
    path: '',
    component: WorkFlowComponent,
    children: [
      {
        path: 'workflow-PR',
        loadChildren: () =>
          import('./work-flow-prpo/work-flow-prpo.module').then(
            (m) => m.WorkFlowPrpoModule
          ),
      },
      {
        path: 'workflow-RFP',
        loadChildren: () =>
          import('./work-flow-rfp/work-flow-rfp.module').then(
            (m) => m.WorkFlowRfpModule
          ),
      },
      {
        path: 'work-flow-job',
        loadChildren: () =>
          import('./work-flow-job/work-flow-job.module').then(
            (m) => m.
              WorkFlowJobModule
          ),
      },
      {
        path: 'customer-approval',
        loadChildren: () =>
          import('./customer-approval/customer-approval.module').then(
            (m) => m.
              CustomerApprovalModule
          ),
      },    
       {
        path: 'credit_wflow',
        children: [
          {
            path: 'credit-limit',
            loadChildren: () =>
              import('./credit-limit/credit-limit.module').then(
                (m) => m.CreditLimitModule
              ),
          },
          { path: 'sanction-credit-limit',
             loadChildren: () =>
              import('./sanction-credit-limit/sanction-credit-limit.module').then(
                m => m.SanctionCreditLimitModule
              ),
             }, 
        ]
      },
      {
        path: 'employee-map-level',
        loadChildren: () =>
          import('./employee-map-with-level/employee-map-with-level.module').then(
            (m) => m.
              EmployeeMapWithLevelModule
          ),
      },
      {
        path: 'quotation-approval',
        loadChildren: () =>
          import('./quotation-approval/quotation-approval.module').then(
            (m) => m.
              QuotationApprovalModule
          ),
      },
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFlowRoutingModule { }
