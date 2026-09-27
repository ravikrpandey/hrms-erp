import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistListComponent } from './checklist-list/checklist-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckListRoutingModule } from './checklist-routing.module';
import { ChecklistDialogComponent } from './checklist-dialog/checklist-dialog.component';
import { ChecklistStatusComponent } from './checklist-status/checklist-status.component';
import { ChecklistActionComponent } from './checklist-action/checklist-action.component';



@NgModule({
  declarations: [
    ChecklistListComponent,
    ChecklistDialogComponent,
    ChecklistStatusComponent,
    ChecklistActionComponent
  ],
  imports: [
    CommonModule,
    CheckListRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChecklistModule {

 }
