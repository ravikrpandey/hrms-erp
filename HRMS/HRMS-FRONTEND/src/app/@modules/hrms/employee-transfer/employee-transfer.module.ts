import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeTransferRoutingModule } from './employee-transfer-routing.module';
import { EmployeeTransferComponent } from './employee-transfer/employee-transfer.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { EmployeeTransferlistComponent } from './employee-transferlist/employee-transferlist.component';
import { ActionComponent } from './action/action.component';
import { MatIconModule } from '@angular/material/icon';
import { CellRenderComponent } from './cell-render/cell-render.component';
import { EmployeeListComponent } from './listing/employee-list/employee-list.component';
import { PendingForApprovalComponent } from './listing/pending-for-approval/pending-for-approval.component';
import { ApprovalComponent } from './listing/approval/approval.component';
import { RejectedComponent } from './listing/rejected/rejected.component';
import { ApprovalFormComponent } from './listing/approval-form/approval-form.component';
import { ApprovalRejectedViewActionComponent } from './listing/approval-rejected-view-action/approval-rejected-view-action.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    EmployeeTransferComponent,
    EmployeeTransferlistComponent,
    ActionComponent,
    CellRenderComponent,
    EmployeeListComponent,
    PendingForApprovalComponent,
    ApprovalComponent,
    RejectedComponent,
    ApprovalFormComponent,
    ApprovalRejectedViewActionComponent,
    

  ],
  imports: [
    CommonModule,
    EmployeeTransferRoutingModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatCardModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    MatSelectFilterModule,
    MatIconModule,
    SearchFilterComponent
  ],
})
export class EmployeeTransferModule {}
