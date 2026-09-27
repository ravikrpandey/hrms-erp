import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesManagementRoutingModule } from './sales-management-routing.module';
import { SalesManagementComponent } from './sales-management.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerformaModule } from './performa/performa.module';
import { QuotationsComponent } from './quotations/quotations.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    SalesManagementComponent,
    QuotationsComponent,

  ],
  imports: [
    CommonModule,
    SalesManagementRoutingModule,
    PerformaModule,
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
    MatSlideToggleModule,
    MatIconModule
  ]
})
export class SalesManagementModule { }
