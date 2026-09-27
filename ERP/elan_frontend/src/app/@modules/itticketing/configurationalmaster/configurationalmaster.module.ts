import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationalmasterRoutingModule } from './configurationalmaster-routing.module';
import { ConfigurationalmasterComponent } from './configurationalmaster.component';

import { CountrymasterComponent } from './countrymaster/countrymaster.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { StatemasterComponent } from './statemaster/statemaster.component';
import { QuotationCurrencyComponent } from './quotation-currency/quotation-currency.component';
import { VendorTypeComponent } from './vendor-type/vendor-type.component';
import { PricemappingComponent } from './pricemapping/pricemapping.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { UsesMasterModule } from './uses-master/uses-master.module';
import { ProductCategoryRoutingModule } from './product-category/product-category-routing.module';
import { IsuueMasterRoutingModule } from './isuue-master/isuue-master-routing.module';
import { ExpectedDeliveryDaysComponent } from './expected-delivery-days/expected-delivery-days.component';
import { ExpectedDeliveryDaysDialogComponent } from './expected-delivery-days/expected-delivery-days-dialog/expected-delivery-days-dialog.component';
import { ExpectedDayStatusComponent } from './expected-delivery-days/expected-day-status/expected-day-status.component';
import { ItemCostCategoryComponent } from './item-cost-category/item-cost-category.component';
import { InstallationKitBomComponent } from './installation-kit-bom/installation-kit-bom.component';
import { CreateKitComponent } from './installation-kit-bom/create-kit/create-kit.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// import { AdditionalChargeComponent } from './additional-charge/additional-charge.component';



@NgModule({
  declarations: [
    ConfigurationalmasterComponent,
    CountrymasterComponent,
    StatemasterComponent,
    QuotationCurrencyComponent,
    VendorTypeComponent,
    PricemappingComponent,
    ExpectedDeliveryDaysComponent,
    ExpectedDeliveryDaysDialogComponent,
    ExpectedDayStatusComponent,
    ItemCostCategoryComponent,
    InstallationKitBomComponent,
    CreateKitComponent,

  ],
  imports: [
    CommonModule,
    ConfigurationalmasterRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule,
    UsesMasterModule,
    ProductCategoryRoutingModule,
    IsuueMasterRoutingModule,
    NgxMatSelectSearchModule
  ]
})
export class ConfigurationalmasterModule { }
