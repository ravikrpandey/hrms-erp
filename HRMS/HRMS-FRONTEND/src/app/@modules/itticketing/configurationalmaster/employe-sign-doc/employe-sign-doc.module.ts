import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeSignDocRoutingModule } from './employe-sign-doc-routing.module';
import { EmployeeCreateSignComponent } from './employee-create-sign/employee-create-sign.component';
import { EmployeeListSignComponent } from './employee-list-sign/employee-list-sign.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EmpDocMasterActionComponent } from './emp-doc-master-action/emp-doc-master-action.component';

@NgModule({
  declarations: [
    EmployeeCreateSignComponent,
    EmployeeListSignComponent,
    EmpDocMasterActionComponent
  ],
  imports: [
    CommonModule,
    EmployeSignDocRoutingModule,
    AgGridModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class EmployeSignDocModule { }
