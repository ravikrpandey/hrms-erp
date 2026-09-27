import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsnSacRoutingModule } from './hsn-sac-routing.module';
import { HsnSacListComponent } from './hsn-sac-list/hsn-sac-list.component';
import { CreateHsnSacComponent } from './create-hsn-sac/create-hsn-sac.component';
import { HsnSacActionComponent } from './hsn-sac-action/hsn-sac-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';


@NgModule({
  declarations: [
    HsnSacListComponent,
    CreateHsnSacComponent,
    HsnSacActionComponent
  ],
  imports: [
    CommonModule,
    HsnSacRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule
  ]
})
export class HsnSacModule { }