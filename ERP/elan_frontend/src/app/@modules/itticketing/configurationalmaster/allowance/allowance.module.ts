import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllowanceRoutingModule } from './allowance-routing.module';
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
import { AllowanceCreateComponent } from './allowance-create/allowance-create.component';
import { AllowanceListComponent } from './allowance-list/allowance-list.component';
import { ActionComponent } from './allowance-list/action/action.component';
import { AlloanceActionStatusComponent } from './allowance-list/action/alloance-action-status/alloance-action-status.component';



@NgModule({
  declarations: [
    AllowanceCreateComponent,
    AllowanceListComponent,
    ActionComponent,
    AlloanceActionStatusComponent
  ],
  imports: [
    CommonModule,
    AllowanceRoutingModule,
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
export class AllowanceModule { }
