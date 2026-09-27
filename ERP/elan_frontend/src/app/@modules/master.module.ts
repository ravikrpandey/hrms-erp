import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from '../@shared/material/material.module';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { SharedModule } from '../@shared/shared.module';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';
import { AllowActionModule } from '../@shared/shaired/allow-action.module';
import { FinanceModule } from './finance/finance.module';
import { PerformanceManagementModule } from './performance-management/performance-management.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CountryComponent } from './dialog-popup-components/country-dialog-popup/country/country.component';
import { StateComponent } from './dialog-popup-components/state-dialog-popup/state/state.component';
import { CityComponent } from './dialog-popup-components/city-dialog-popup/city/city.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ShairedModule } from '../@shared/shaired/shaired.module';

@NgModule({
  declarations: [
    MasterComponent,
    CountryComponent,
    StateComponent,
    CityComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MasterRoutingModule,
    FormsModule,
    SharedModule,
    FinanceModule,
    HttpClientModule,
    ToastrModule,
    MaterialModule,
    LoadingBarHttpClientModule,
    AllowActionModule,
    PerformanceManagementModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectFilterModule,
    ShairedModule
  ],
  providers: [
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 100 } },
  ],
})
export class MasterModule { }
