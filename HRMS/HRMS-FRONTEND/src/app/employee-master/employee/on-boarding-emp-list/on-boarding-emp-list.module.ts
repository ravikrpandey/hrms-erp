import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnBoardingEmpListRoutingModule } from './on-boarding-emp-list-routing.module';
import { OnBoardingEmpListComponent } from './on-boarding-emp-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { OnActionComponent } from './on-action/on-action.component';


@NgModule({
  declarations: [
    OnBoardingEmpListComponent,
    OnActionComponent
  ],
  imports: [
    CommonModule,
    OnBoardingEmpListRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class OnBoardingEmpListModule { }
