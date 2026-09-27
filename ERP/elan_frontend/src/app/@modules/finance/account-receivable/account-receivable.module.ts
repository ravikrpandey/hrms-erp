import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountReceivableRoutingModule } from './account-receivable-routing.module';
import { AccountReceivableComponent } from './account-receivable.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AccountReceivableComponent   
  ],
  imports: [
    CommonModule,
    AccountReceivableRoutingModule,
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
export class AccountReceivableModule { }
