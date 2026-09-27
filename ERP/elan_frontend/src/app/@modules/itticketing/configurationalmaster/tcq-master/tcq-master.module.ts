import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

import { TcqMasterRoutingModule } from './tcq-master-routing.module';
import { TcqMasterComponent } from './tcq-master.component';
import { TermofdeliveryComponent } from './termofdelivery/termofdelivery.component';
import { PaymentcategoryComponent } from './paymentcategory/paymentcategory.component';
import { PaymentsubcategoryComponent } from './paymentsubcategory/paymentsubcategory.component';
import { FreightComponent } from './freight/freight.component';
import { InsuranceComponent } from './insurance/insurance.component';

import { CreateFreightComponent } from './freight/create-freight/create-freight.component';
import { FreightActionComponent } from './freight/freight-action/freight-action.component';
import { CreateInsurranceComponent } from './insurance/create-insurrance/create-insurrance.component';
import { InsurranceActionComponent } from './insurance/insurrance-action/insurrance-action.component';
import { CreatePaymentCategoryComponent } from './paymentcategory/create-payment-category/create-payment-category.component';
import { PaymentCategoryActionComponent } from './paymentcategory/payment-category-action/payment-category-action.component';
import { CreatePaymentSubcategoryComponent } from './paymentsubcategory/create-payment-subcategory/create-payment-subcategory.component';
import { PaymentSubcategoryActionComponent } from './paymentsubcategory/payment-subcategory-action/payment-subcategory-action.component';
import { CreateTermsUnloadingComponent } from './termofdelivery/create-terms-unloading/create-terms-unloading.component';
import { TermsActionComponent } from './termofdelivery/terms-action/terms-action.component';
import { LeadSourceComponent } from './lead-source/lead-source.component';
import { CreateLeadSourceComponent } from './lead-source/create-lead-source/create-lead-source.component';
import { LeadSourceActionComponent } from './lead-source/lead-source-action/lead-source-action.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentTermsFormComponent } from './payment-terms/payment-terms-form/payment-terms-form.component';
import { PaymentTermsActionComponent } from './payment-terms/payment-terms-action/payment-terms-action.component';

@NgModule({
  declarations: [
    TcqMasterComponent,
    TermofdeliveryComponent,
    PaymentcategoryComponent,
    PaymentsubcategoryComponent,
    FreightComponent,
    InsuranceComponent,
    CreateFreightComponent,
    FreightActionComponent,
    CreateInsurranceComponent,
    InsurranceActionComponent,
    CreatePaymentCategoryComponent,
    PaymentCategoryActionComponent,
    CreatePaymentSubcategoryComponent,
    PaymentSubcategoryActionComponent,
    CreateTermsUnloadingComponent,
    TermsActionComponent,
    LeadSourceComponent,
    CreateLeadSourceComponent,
    LeadSourceActionComponent,
    PaymentTermsComponent,
    PaymentTermsFormComponent,
    PaymentTermsActionComponent,
  ],
  imports: [
    CommonModule,
    TcqMasterRoutingModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TcqMasterModule { }
