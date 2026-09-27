import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchSetupRoutingModule } from './branch-setup-routing.module';
import { BranchSetupListComponent } from './branch-setup-list/branch-setup-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BranchSetupCreateComponent } from './branch-setup-create/branch-setup-create.component';
import { BranchSetupActionComponent } from './branch-setup-action/branch-setup-action.component';
import { BranchSetupDialogComponent } from './branch-setup-dialog/branch-setup-dialog.component';
import { BranchSetupStatusComponent } from './branch-setup-action/branch-setup-status/branch-setup-status.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
// import { CountryPipe } from 'src/app/@shared/pipe/filterPipes/country.pipe';

@NgModule({
  declarations: [
    BranchSetupListComponent,
    BranchSetupCreateComponent,
    BranchSetupActionComponent,
    BranchSetupDialogComponent,
    BranchSetupStatusComponent,
    // CountryPipe
  ],
  imports: [
    CommonModule,
    BranchSetupRoutingModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,
    SearchFilterComponent
  ]
})
export class BranchSetupModule { }
