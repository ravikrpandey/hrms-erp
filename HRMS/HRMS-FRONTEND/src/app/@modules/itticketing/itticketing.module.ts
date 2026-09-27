import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItticketingRoutingModule } from './itticketing-routing.module';
import { ItticketingComponent } from './itticketing.component';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { HrmsModule } from '../hrms/hrms.module';
 

@NgModule({
  declarations: [
    ItticketingComponent
  ],
  imports: [
    CommonModule,
    ItticketingRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    
  ]
})
export class ItticketingModule { }
