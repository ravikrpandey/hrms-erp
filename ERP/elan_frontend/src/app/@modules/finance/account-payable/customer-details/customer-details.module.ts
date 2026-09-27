import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDetailsRoutingModule } from './customer-details-routing.module';
import { CustomerDetailsListComponent } from './customer-details-list/customer-details-list.component';


@NgModule({
  declarations: [
    CustomerDetailsListComponent
  ],
  imports: [
    CommonModule,
    CustomerDetailsRoutingModule
  ]
})
export class CustomerDetailsModule { }
