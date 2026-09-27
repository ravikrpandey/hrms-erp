import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalLevelCreateComponent } from './approval-level-create/approval-level-create.component';
import { ApprovalLevelActionComponent } from './approval-level-action/approval-level-action.component';
import { ApprovalLevelListComponent } from './approval-level-list/approval-level-list.component';
import { ProcurementWorkflowRoutingModule } from './procurment-workflow-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';



@NgModule({
  declarations: [
    ApprovalLevelCreateComponent,
    ApprovalLevelActionComponent,
    ApprovalLevelListComponent
  ],
  imports: [
    CommonModule,
    ProcurementWorkflowRoutingModule,   
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    AgGridModule
  ]
})
export class ProcurementWorkFlowModule { }
