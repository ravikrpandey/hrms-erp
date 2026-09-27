import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './payroll.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './request.interceptor';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { PaySlipModule } from './pay-slip/pay-slip.module';


@NgModule({
  declarations: [
    PayrollComponent
  ],
  imports: [
    CommonModule,
    ShairedModule,
    PayrollRoutingModule,
    HttpClientModule,
    PaySlipModule
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
export class PayrollModule { }
