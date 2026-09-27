import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtMasterRoutingModule } from './kt-master-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { KtMasterList } from './kt-master-list/kt-master-list';
import { KtMasterCreateDialog } from './kt-master-create-dialog/kt-master-create-dialog';
import { KtMasterAction } from './kt-master-action/kt-master-action';
import { KtMasterStatus } from './kt-master-status/kt-master-status';


@NgModule({
  declarations: [
    KtMasterList,
    KtMasterCreateDialog,
    KtMasterAction,
    KtMasterStatus
  ],
  imports: [
    CommonModule,
    KtMasterRoutingModule,
    FormsModule,
        ReactiveFormsModule,
        AgGridModule,
        MaterialModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        MatSelectFilterModule
  ]
})
export class KtMasterModule { }
