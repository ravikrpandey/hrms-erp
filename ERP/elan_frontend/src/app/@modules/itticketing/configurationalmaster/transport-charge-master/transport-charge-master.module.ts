import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportChargeMasterRoutingModule } from './transport-charge-master-routing.module';
import { TransportChargeMasterComponent } from './transport-charge-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { CreateTransportChargeComponent } from './create-transport-charge/create-transport-charge.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TransporterChargeActionComponent } from './transporter-charge-action/transporter-charge-action.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    TransportChargeMasterComponent,
    CreateTransportChargeComponent,
    TransporterChargeActionComponent
  ],
  imports: [
    CommonModule,
    TransportChargeMasterRoutingModule,
     MaterialModule,
        AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule
  ]
})
export class TransportChargeMasterModule { }
