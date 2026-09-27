import { AttachmentsDocumentsComponent } from './attachments-documents/attachments-documents.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverMasterComponent } from './driver-master.component';
import { CreateDriverMasterComponent } from './create-driver-master/create-driver-master.component';
import { BasicDriverComponent } from './basic-driver/basic-driver.component';
import { ContactAddressComponent } from './contact-address/contact-address.component';
import { LicenseComplianceComponent } from './license-compliance/license-compliance.component';
import { EmploymentAssignmentComponent } from './employment-assignment/employment-assignment.component';
import { CreateDriverComponent } from './create-driver/create-driver.component';

const routes: Routes = [
  {path:'',component:DriverMasterComponent},
  // {path:'create-driver',component:CreateDriverMasterComponent,
  //   children:[
  //     {path:'basic-driver',component:BasicDriverComponent},
  //     {path:'contact-address',component:ContactAddressComponent},
  //     {path:'license-compliance',component:LicenseComplianceComponent},
  //     {path:'employment-assignment',component:EmploymentAssignmentComponent},
  //     {path:'attachments-Documents',component:AttachmentsDocumentsComponent}
  //   ]
  // }
  {path : 'create-driver', component: CreateDriverComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverMasterRoutingModule { }
