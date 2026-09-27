import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { ManpowerRequestRoutingModule } from './manpower-request-routing.module';
import { ManpowerRequestComponent } from './manpower-request.component';
import { ApprovalComponent } from './approval/approval.component';
import { RejectComponent } from './reject/reject.component';
import { ManpowerRequestDialogComponent } from './manpower-request-dialog/manpower-request-dialog.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [
    ManpowerRequestComponent,
    RejectComponent,
    ManpowerRequestDialogComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    ManpowerRequestRoutingModule,
    MaterialModule,
    CKEditorModule
  ]
})
export class ManpowerRequestModule { }
