import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TcqMasterComponent } from './tcq-master.component';
import { TermofdeliveryComponent } from './termofdelivery/termofdelivery.component';
import { PaymentcategoryComponent } from './paymentcategory/paymentcategory.component';
import { PaymentsubcategoryComponent } from './paymentsubcategory/paymentsubcategory.component';
import { FreightComponent } from './freight/freight.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { CreateFreightComponent } from './freight/create-freight/create-freight.component';
import { CreateInsurranceComponent } from './insurance/create-insurrance/create-insurrance.component';
import { CreatePaymentCategoryComponent } from './paymentcategory/create-payment-category/create-payment-category.component';
import { CreatePaymentSubcategoryComponent } from './paymentsubcategory/create-payment-subcategory/create-payment-subcategory.component';
import { CreateTermsUnloadingComponent } from './termofdelivery/create-terms-unloading/create-terms-unloading.component';
import { LeadSourceComponent } from './lead-source/lead-source.component';
import { CreateLeadSourceComponent } from './lead-source/create-lead-source/create-lead-source.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentTermsFormComponent } from './payment-terms/payment-terms-form/payment-terms-form.component';

const routes: Routes = [
  { path: '', component: TcqMasterComponent },
  { path: 'termofdelivery', component: TermofdeliveryComponent },
  { path: 'termunloading/create', component: CreateTermsUnloadingComponent },
  { path: 'lead-source', component: LeadSourceComponent },
  { path: 'lead-source/create', component: CreateLeadSourceComponent },
  { path: 'paymentcategory', component: PaymentcategoryComponent },
  { path: 'paymentcategory/create', component: CreatePaymentCategoryComponent },
  { path: 'paymentsubcategory', component: PaymentsubcategoryComponent },
  {
    path: 'paymentsubcategory/create',
    component: CreatePaymentSubcategoryComponent,
  },
  { path: 'freight', component: FreightComponent },
  { path: 'freight/create', component: CreateFreightComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'insurance/create', component: CreateInsurranceComponent },
  { path: 'payment', component: PaymentTermsComponent },
  { path: 'payment/create', component: PaymentTermsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TcqMasterRoutingModule {}
