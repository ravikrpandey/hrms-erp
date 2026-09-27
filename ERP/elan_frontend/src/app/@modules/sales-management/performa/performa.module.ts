import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformaRoutingModule } from './performa-routing.module';
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
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { PerformaComponent } from './performa.component';
import { CreateProformasComponent } from './create-proformas/create-proformas.component';
import { ApprovedProformasComponent } from './approved-proformas/approved-proformas.component';
import { RejectedProformasComponent } from './rejected-proformas/rejected-proformas.component';
import { PendingProformasComponent } from './pending-proformas/pending-proformas.component';
import { MatIconModule } from '@angular/material/icon';
import { ProformaStatusComponent } from './proforma-status/proforma-status.component';
import { ProformaActionComponent } from './proforma-action/proforma-action.component';

@NgModule({
  declarations: [
   PerformaComponent,
   CreateProformasComponent,
   ApprovedProformasComponent,
   RejectedProformasComponent,
   PendingProformasComponent,
   ProformaStatusComponent,
   ProformaActionComponent
  ],

  imports: [
    CommonModule,
    PerformaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    MatIconModule
  ]
})
export class PerformaModule { }
