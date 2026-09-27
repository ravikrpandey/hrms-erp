import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmServiceRoutingModule } from './crm-service-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterComplainComponent } from './register-complain/register-complain.component';
import { CrmServiceComponent } from './crm-service.component';
import { OpenComplaintsComponent } from './open-complaints/open-complaints.component';
import { ServiceCenterComplaintComponent } from './service-center-complaint/service-center-complaint/service-center-complaint.component';
import { MaterialRequestComponent } from './service-center-complaint/material-request/material-request.component';
import { AddMaterialItemComponent } from './service-center-complaint/add-material-item/add-material-item.component';
import { ViewLeadDescriptionDialogComponent } from './complaint-list/view-lead-description-dialog.component';


@NgModule({
  declarations: [
    CrmServiceComponent,
    RegisterComplainComponent,
    OpenComplaintsComponent,
    ServiceCenterComplaintComponent,
    MaterialRequestComponent,
    AddMaterialItemComponent,
    ViewLeadDescriptionDialogComponent,
  ],
  imports: [
    CommonModule,
    CrmServiceRoutingModule,
    AgGridModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    ShairedModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule
  ]
})
export class CrmServiceModule { }
