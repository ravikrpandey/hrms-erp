import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountPayableRoutingModule } from './account-payable-routing.module';
import { AccountPayableComponent } from './account-payable.component';
import { ActionPayableComponent } from './action-payable/action-payable.component';
import { DialogAccountPayableComponent } from './dialog-account-payable/dialog-account-payable.component';


@NgModule({
  declarations: [
    AccountPayableComponent,
    ActionPayableComponent,
    DialogAccountPayableComponent   
  ],
  imports: [
    CommonModule,
    AccountPayableRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule

  ]
})
export class AccountPayableModule { }
