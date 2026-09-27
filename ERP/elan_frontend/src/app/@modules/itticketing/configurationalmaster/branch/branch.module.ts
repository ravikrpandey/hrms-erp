import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { BranchActionComponent } from './branch-action/branch-action.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BranchComponent, BranchActionComponent, BranchFormComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    AgGridModule,
    MaterialModule,
    ShairedModule,
    ReactiveFormsModule,
  ],
})
export class BranchModule {}
