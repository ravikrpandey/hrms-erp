import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfitCenterRoutingModule } from './profit-center-routing.module';

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
import { ProfitCenterComponent } from './profit-center.component';
import { AddProfitCenterComponent } from './add-profit-center/add-profit-center.component';
import { ProfitCenterHierarchyViewComponent } from './profit-center-hierarchy-view/profit-center-hierarchy-view.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ProfitCenterActionComponent } from './profit-center-action/profit-center-action.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ProfitCenterComponent,
    AddProfitCenterComponent,

    ProfitCenterHierarchyViewComponent,
          ProfitCenterActionComponent
  ],
  imports: [
    CommonModule,
    ProfitCenterRoutingModule,
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
    MatSelectFilterModule,
    MatIconModule
  ]
})
export class ProfitCenterModule { }
