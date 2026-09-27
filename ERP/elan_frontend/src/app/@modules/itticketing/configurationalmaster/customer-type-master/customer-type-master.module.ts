import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeMasterRoutingModule } from './customer-type-master-routing.module';
import { CustomerTypeMasterComponent } from './customer-type-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerActionComponent } from './customer-action/customer-action.component';
import { CustomerTypeStatusComponent } from './customer-type-status/customer-type-status.component';


@NgModule({
  declarations: [
    CustomerTypeMasterComponent,
    AddCustomerComponent,
    CustomerActionComponent,
    CustomerTypeStatusComponent
  ],
  imports: [
    CommonModule,
    CustomerTypeMasterRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerTypeMasterModule { }
