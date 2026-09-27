import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollSalerySlipRoutingModule } from './payroll-salery-slip-routing.module';
import { PayrollSalerySlipComponent } from './payroll-salery-slip/payroll-salery-slip.component';
import { AgGridModule } from 'ag-grid-angular';
// import { ApprovalSalerySlipComponent } from './pending-approval-salery/approval-salery-slip.component';
import { SalaryApprovalSlipComponent } from './salary-approval-slip/salary-approval-slip.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SalarySlipActionComponent } from './salary-slip-action/salary-slip-action.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [PayrollSalerySlipComponent,SalaryApprovalSlipComponent, SalarySlipActionComponent],
  imports: [
    CommonModule,
    PayrollSalerySlipRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    MatSelectFilterModule,
    SearchFilterComponent

  ]
})
export class PayrollSalerySlipModule { }
