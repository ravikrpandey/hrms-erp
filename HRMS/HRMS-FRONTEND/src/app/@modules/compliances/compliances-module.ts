import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompliancesRoutingModule } from './compliances-routing-module';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { Compliances } from './compliances';
import { HealthList } from './health-list/health-list';
import { HealthCreate } from './health-create/health-create';
import { WelfareList } from './welfare-list/welfare-list';
import { SafetyList } from './safety-list/safety-list';
import { HealthAction } from './health-action/health-action';
import { SafetyCreate } from './safety-create/safety-create';
import { SafetyAction } from './safety-action/safety-action';
import { WelfareCreate } from './welfare-create/welfare-create';
import { WelfareAction } from './welfare-action/welfare-action';



@NgModule({
  declarations: [
    Compliances,
    HealthList,
    HealthCreate,
    HealthAction,
    SafetyList,
    SafetyCreate,
    SafetyAction,
    WelfareList,
    WelfareCreate,
    WelfareAction
  ],
  imports: [
    CommonModule,
    CompliancesRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    ShairedModule,
    MatNativeDateModule,
    MatSelectFilterModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class CompliancesModule { }
