import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMasterRoutingModule } from './employee-master-routing.module';
import { EmployeeMasterComponent } from './employee-master.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './request.interceptor';
import { ChangePasswordComponent } from './change-password/change-password.component';
@NgModule({
  declarations: [
    EmployeeMasterComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    EmployeeMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    FormsModule
  ],
  providers: [
    PayrollService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true  
    }, 
  ]
})
export class EmployeeMasterModule { }
