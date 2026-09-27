import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticePeriodListRoutingModule } from './notice-period-list-routing-module';
import { NoticePeriodList } from './notice-period-list';
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
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoticePeriodAction } from './notice-period-action/notice-period-action';
import { NoticePeriodDialog } from './notice-period-dialog/notice-period-dialog';
import { NoticePeriodStatus } from './notice-period-status/notice-period-status';


@NgModule({
  declarations: [
    NoticePeriodList,
    NoticePeriodAction,
    NoticePeriodDialog,
    NoticePeriodStatus
  ],
  imports: [
    CommonModule,
    NoticePeriodListRoutingModule,
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
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class NoticePeriodListModule { }
