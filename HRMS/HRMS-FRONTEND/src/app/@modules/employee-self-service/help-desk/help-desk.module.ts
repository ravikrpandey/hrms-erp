import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { HelpDeskListComponent } from './help-desk-list/help-desk-list.component';
import { HelpDeskCreateComponent } from './help-desk-create/help-desk-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActionComponent } from './help-desk-list/action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpDeskDialogComponent } from './help-desk-dialog/help-desk-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    HelpDeskListComponent,
    HelpDeskCreateComponent,
    ActionComponent,
    HelpDeskDialogComponent
  ],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    
    ReactiveFormsModule,
  ]
})
export class HelpDeskModule { }
