import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgTypeMasterRoutingModule } from './org-type-master-routing.module';
import { OrgTypeMasterComponent } from './org-type-master.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { OrgTypeMasterFormComponent } from './org-type-master-form/org-type-master-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';

@NgModule({
  declarations: [OrgTypeMasterComponent, OrgTypeMasterFormComponent],
  imports: [
    CommonModule,
    OrgTypeMasterRoutingModule,
    ShairedModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule
  ],
})
export class OrgTypeMasterModule {}
