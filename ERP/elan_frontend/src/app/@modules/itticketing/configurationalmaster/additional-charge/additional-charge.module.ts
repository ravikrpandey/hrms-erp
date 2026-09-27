import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdditionalChargeActionComponent } from './additional-charge-action/additional-charge-action.component';
import { AdditionalChargeDilogComponent } from './additional-charge-dilog/additional-charge-dilog.component';
import { AdditionalChargeRoutingModule } from './additional-charge-routing.module';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdditionalChargeStatusActionComponent } from './additional-charge-action/additional-charge-status-action/additional-charge-status-action.component';
import { AdditionalChargeComponent } from './additional-charge.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    AdditionalChargeActionComponent,
    AdditionalChargeDilogComponent,
    AdditionalChargeStatusActionComponent,
    AdditionalChargeComponent
  ],
  imports: [
    CommonModule,
    AdditionalChargeRoutingModule,
   AgGridModule,
     ReactiveFormsModule,
       FormsModule,
       MatFormFieldModule,
       MatInputModule,
       MatCardModule,
       MatDialogModule,
       MatExpansionModule,
       MatSidenavModule,
       MatListModule,
       MatSelectFilterModule,
       MatSelectModule,
       MatDatepickerModule,
       MatIconModule,
       MatTooltipModule,
       MaterialModule
       
       
 

  ]
})
export class AdditionalChargeModule { }
