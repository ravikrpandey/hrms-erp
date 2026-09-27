import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AuditorMasterRoutingModule } from './auditor-master-routing.module';
import { AuditorListComponent } from './auditor-master-list/auditor-master-list.component';
import { ActionComponent } from './action/action.component';
import { UploadCsvPopupComponent } from './upload-csv-popup/upload-csv-popup.component';


@NgModule({
  declarations: [
    AuditorListComponent,
    ActionComponent,
    UploadCsvPopupComponent
  ],
  imports: [
    CommonModule,
    AuditorMasterRoutingModule,
    AgGridModule,
    MaterialModule
  ]
})
export class AuditorMasterModule { }
