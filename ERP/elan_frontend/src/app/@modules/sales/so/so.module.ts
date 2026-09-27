import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoRoutingModule } from './so-routing.module';
import { SoListComponent } from './so-list.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SoActionComponent } from './so-action/so-action.component';
import { CreateSoComponent } from './create-so/create-so.component';
import { SoHistoryComponent } from './so-history/so-history.component';
import { MapAddressQtyDialogComponent } from './create-so/map-address-qty-dialog/map-address-qty-dialog.component';
import { UpdateSoDateComponent } from './create-so/update-so-date/update-so-date.component';
import { SoDialogComponent } from './so-dialog/so-dialog.component';
import { ViewReasonsComponent } from './view-reasons/view-reasons.component';
import { SoHistoryActionComponent } from './so-history/so-history-action/so-history-action.component';
import { SoInvoiceComponent } from './so-invoice/so-invoice.component';


@NgModule({
  declarations: [
    SoListComponent,
    SoActionComponent,
    CreateSoComponent,
    SoHistoryComponent,
    MapAddressQtyDialogComponent,
    UpdateSoDateComponent,
    SoDialogComponent,
    ViewReasonsComponent,
    SoHistoryActionComponent,
    SoInvoiceComponent
  ],
  imports: [
    CommonModule,
    SoRoutingModule,
    ShairedModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MaterialModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectFilterModule,
    MatIconModule
  ]
})
export class SoModule { }
