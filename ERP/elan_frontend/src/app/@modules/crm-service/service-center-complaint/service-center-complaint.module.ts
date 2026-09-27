import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceCenterComplaintRoutingModule } from './service-center-complaint-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CrmServiceRoutingModule } from '../crm-service-routing.module';
import { MaterialRequestComponent } from './material-request/material-request.component';
import { AddMaterialItemComponent } from './add-material-item/add-material-item.component';

@NgModule({
  declarations: [
    // ServiceCenterComplaintComponent
  
    MaterialRequestComponent,
    AddMaterialItemComponent,
  ],
  imports: [
    CommonModule,
    ServiceCenterComplaintRoutingModule,
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
export class ServiceCenterComplaintModule { }
