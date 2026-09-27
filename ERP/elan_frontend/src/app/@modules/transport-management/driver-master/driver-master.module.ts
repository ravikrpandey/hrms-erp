import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverMasterRoutingModule } from './driver-master-routing.module';
import { DriverMasterComponent } from './driver-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateDriverMasterComponent } from './create-driver-master/create-driver-master.component';
import { BasicDriverComponent } from './basic-driver/basic-driver.component';
import { ContactAddressComponent } from './contact-address/contact-address.component';
import { LicenseComplianceComponent } from './license-compliance/license-compliance.component';
import { EmploymentAssignmentComponent } from './employment-assignment/employment-assignment.component';
import { AttachmentsDocumentsComponent } from './attachments-documents/attachments-documents.component';
import { DriverActionComponent } from './driver-action/driver-action.component';
import { CreateDriverComponent } from './create-driver/create-driver.component';


@NgModule({
  declarations: [
    DriverMasterComponent,
    CreateDriverMasterComponent,
    BasicDriverComponent,
    ContactAddressComponent,
    LicenseComplianceComponent,
    EmploymentAssignmentComponent,
    AttachmentsDocumentsComponent,
    DriverActionComponent,
    CreateDriverComponent
  ],
  imports: [
    CommonModule,
    DriverMasterRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DriverMasterModule { }
