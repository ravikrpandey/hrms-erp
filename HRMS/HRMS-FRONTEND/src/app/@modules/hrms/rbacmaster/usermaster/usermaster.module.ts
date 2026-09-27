import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermasterRoutingModule } from './usermaster-routing.module';
import { menuMasterComponent } from './menu-master/menu-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActionsComponent } from './actions/actions.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AssignActionPopupComponent } from './menu-master/assign-action-popup/assign-action-popup.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    menuMasterComponent,
    ActionsComponent,
    AssignActionPopupComponent
  ],
  imports: [
    CommonModule,
    UsermasterRoutingModule,
    AgGridModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CdkAccordionModule,
    MatSelectFilterModule,
    SearchFilterComponent
  ]
})
export class UsermasterModule { }
