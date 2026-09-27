import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryTemplateRoutingModule } from './salary-template-routing.module';
import { SalaryTemplateListComponent } from './salary-template-list/salary-template-list.component';
import { SalaryTemplateCreateComponent } from './salary-template-create/salary-template-create.component';
import { SalaryTemplateViewComponent } from './salary-template-view/salary-template-view.component';
import { SalaryTemplateActionComponent } from './salary-template-action/salary-template-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    SalaryTemplateListComponent,
    SalaryTemplateCreateComponent,
    SalaryTemplateViewComponent,
    SalaryTemplateActionComponent
  ],
  imports: [
    CommonModule,
    SalaryTemplateRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SalaryTemplateModule { }
