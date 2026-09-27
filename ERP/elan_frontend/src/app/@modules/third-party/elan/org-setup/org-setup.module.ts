import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgSetupRoutingModule } from './org-setup-routing.module';
import { OrgSetupComponent } from './org-setup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { OrgSetupFormDialogComponent } from './org-setup-form-dialog/org-setup-form-dialog.component';

@NgModule({
  declarations: [OrgSetupComponent, OrgSetupFormDialogComponent],
  imports: [
    CommonModule,
    OrgSetupRoutingModule,
    ShairedModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class OrgSetupModule {}
