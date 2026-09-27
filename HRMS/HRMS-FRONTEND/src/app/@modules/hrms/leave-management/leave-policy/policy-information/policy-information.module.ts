import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyInformationRoutingModule } from './policy-information-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { LeavePolicyRoutingModule } from '../leave-policy-routing.module';
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';


@NgModule({
  declarations: [
    // LeaveDetailsComponent,
    
  ],
  imports: [
    CommonModule,
    PolicyInformationRoutingModule,
    ReactiveFormsModule,
    LeavePolicyRoutingModule,
    ReactiveFormsModule, 
    FormsModule ,
    MatButtonModule,
    MatSelectFilterModule,
    MaterialModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    AgGridModule,
  ]
})
export class PolicyInformationModule { }
