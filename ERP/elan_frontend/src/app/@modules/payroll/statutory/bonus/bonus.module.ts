import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusRoutingModule } from './bonus-routing.module';
import { BonusCreateComponent } from './bonus-create/bonus-create.component';
import { BonusListComponent } from './bonus-list/bonus-list.component';
import { BonusActionComponent } from './bonus-action/bonus-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    BonusCreateComponent,
    BonusListComponent,
    BonusActionComponent
  ],
  imports: [
    CommonModule,
    BonusRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BonusModule { }
