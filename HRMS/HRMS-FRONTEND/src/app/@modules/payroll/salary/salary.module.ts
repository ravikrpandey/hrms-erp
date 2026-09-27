import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryRoutingModule } from './salary-routing.module';
import { SalaryComponent } from './salary/salary.component';


@NgModule({
  declarations: [
    SalaryComponent
  ],
  imports: [
    CommonModule,
    SalaryRoutingModule
  ]
})
export class SalaryModule { }
