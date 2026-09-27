import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicegoryRoutingModule } from './service-category-routing.module';
import { ServiceCategoryComponent } from './service-category.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ServiceCategoryActionComponent } from './service-category-action/service-category-action.component'; 
import { ServiceCategoryDilogComponent } from './service-category-dilog/service-category-dilog.component';
import { ServiceCategoryStatusActionComponent } from './service-category-action/service-category-status-action/service-category-status-action.component'
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

@NgModule({
  declarations: [
    ServiceCategoryComponent,
    ServiceCategoryActionComponent,
    ServiceCategoryDilogComponent,
    ServiceCategoryStatusActionComponent

  ],
  imports: [
    CommonModule,
    ServicegoryRoutingModule,
    MaterialModule,
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

  ]
})
export class ServiceCategoryModule { }
