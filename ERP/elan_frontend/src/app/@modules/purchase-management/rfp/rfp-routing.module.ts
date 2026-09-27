import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfpComponent } from './rfp.component';
import { CreateRfpComponent } from './create-rfp/create-rfp.component';
import { RfpQuotationDetailsComponent } from './rfp-quotation-details/rfp-quotation-details.component';

const routes: Routes = [
  { path: '', component: RfpComponent },
  { path: 'send-rfp', component: CreateRfpComponent },
  { path: 'quotation-details', component: RfpQuotationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfpRoutingModule { }
