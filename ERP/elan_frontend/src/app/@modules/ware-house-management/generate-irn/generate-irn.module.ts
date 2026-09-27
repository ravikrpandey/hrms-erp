import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateIrnRoutingModule } from './generate-irn-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { GenerateIrnListComponent } from './generate-irn-list/generate-irn-list.component';
import { GenerateIrnActionComponent } from './generate-irn-action/generate-irn-action.component';


@NgModule({
  declarations: [
    GenerateIrnListComponent,
    GenerateIrnActionComponent
  ],
  imports: [
    CommonModule,
    GenerateIrnRoutingModule,

    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
  ]
})
export class GenerateIrnModule { }
