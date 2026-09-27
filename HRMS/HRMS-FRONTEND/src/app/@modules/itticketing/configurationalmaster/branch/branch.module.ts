import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { BranchActionComponent } from './branch-action/branch-action.component';
import { BranchDialogComponent } from './branch-dialog/branch-dialog.component';


@NgModule({
  declarations: [
    BranchComponent,
    BranchActionComponent,
    BranchDialogComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class BranchModule { }
