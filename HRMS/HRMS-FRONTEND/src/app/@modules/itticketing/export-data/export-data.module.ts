import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ToastrModule } from 'ngx-toastr';
import { ExportRoutingModule } from './export-data-routing.module';
import { ExportDataComponent } from './export-data.component';


@NgModule({
  declarations: [
    ExportDataComponent
  ],
  imports: [
    CommonModule,
    ExportRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    // NgModule
    // listPrint

  ],
  providers:[]
  
})
export class ExportDataModule { }
