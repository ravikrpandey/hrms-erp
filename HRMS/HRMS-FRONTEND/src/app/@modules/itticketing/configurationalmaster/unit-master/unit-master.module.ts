import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitMasterRoutingModule } from './unit-master-routing.module';
import { UnitMasterComponent } from './unit-master.component';
import { UnitActionComponent } from './unit-action/unit-action.component';
import { UnitDialogComponent } from './unit-dialog/unit-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    UnitMasterComponent,
    UnitActionComponent,
    UnitDialogComponent
  ],
  imports: [
    CommonModule,
    UnitMasterRoutingModule,
    AgGridModule,
    MaterialModule,
    MatIconModule,
    FormsModule,ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class UnitMasterModule { }
