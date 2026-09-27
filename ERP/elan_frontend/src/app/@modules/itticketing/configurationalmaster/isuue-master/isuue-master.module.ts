import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsuueMasterRoutingModule } from './isuue-master-routing.module';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';
import { IssueActionComponent } from './issue-action/issue-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { IssueStatusComponent } from './issue-status/issue-status.component';


@NgModule({
  declarations: [
    IssueListComponent,
    IssueCreateComponent,
    IssueActionComponent,
    IssueStatusComponent
  ],
  imports: [
    CommonModule,
    IsuueMasterRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class IsuueMasterModule { }
