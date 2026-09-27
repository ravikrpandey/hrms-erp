import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostCenterComponent } from './cost-center.component';
import { CostCenterActionComponent } from './cost-center-action/cost-center-action.component';
import { CostCenterDilogComponent } from './cost-center-dilog/cost-center-dilog.component';
import { CostCenterCreateComponent } from './cost-center-create/cost-center-create.component';
import { CostCenterStatusComponent } from './cost-center-action/cost-center-status/cost-center-status.component';
import { CostCenterRoutingModule } from './cost-center-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExtendDateCostComponent } from './extend-date-cost/extend-date-cost.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
 



@NgModule({
  declarations: [
    CostCenterComponent,
    CostCenterActionComponent,
    CostCenterDilogComponent,
    CostCenterCreateComponent,
    CostCenterStatusComponent,
    ExtendDateCostComponent,
     
  ],
  imports: [
    CommonModule,
    CostCenterRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectFilterModule,
    ShairedModule
  ]
})
export class CostCenterModule { }
