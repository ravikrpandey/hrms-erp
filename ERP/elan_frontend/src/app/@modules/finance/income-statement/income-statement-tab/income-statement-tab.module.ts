import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeStatementTabRoutingModule } from './income-statement-tab-routing.module';
import { IncomeStatementTabComponent } from './income-statement-tab.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IncomeStatementTabRoutingModule
  ]
})
export class IncomeStatementTabModule { }