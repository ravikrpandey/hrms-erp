import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetMasterRoutingModule } from './budget-master-routing.module';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BudgetCreateComponent } from './budget-create/budget-create.component';
import { BudgetActionComponent } from './budget-action/budget-action.component';
import { BudgetStatusComponent } from './budget-action/budget-status/budget-status.component';
import { BudgetExtendListComponent } from './budget-extend-list/budget-extend-list.component';
import { BudgetExtendDialogComponent } from './budget-extend-dialog/budget-extend-dialog.component';


@NgModule({
  declarations: [
    BudgetListComponent,
    BudgetCreateComponent,
    BudgetActionComponent,
    BudgetStatusComponent,
    BudgetExtendListComponent,
    BudgetExtendDialogComponent
  ],
  imports: [
    CommonModule,
    BudgetMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class BudgetMasterModule { }
