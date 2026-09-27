import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActionComponent } from './action/action.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';

@NgModule({
  declarations: [
    CustomerTypeComponent,
    ActionComponent,
    CustomerDialogComponent
  ],
  imports: [
    CommonModule,
    CustomerTypeRoutingModule,   
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    AgGridModule
   
  ]
})
export class CustomerTypeModule { }
