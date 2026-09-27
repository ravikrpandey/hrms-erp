import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProbationEditComponent } from './probation-create/probation-create.component';
import { EmployeProbationComponent } from './probation-list/employe-probation.component';
import { ProbationRoutingModule } from './employee-probation-routing.module';


@NgModule({
  declarations: [
    ProbationEditComponent,
    EmployeProbationComponent
  ],
  imports: [
    CommonModule,
    ProbationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    
    ReactiveFormsModule,
  ]
})
export class ProbationModule { }
