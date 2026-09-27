import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDetailsComponent } from './vendor-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

const routes: Routes = [
  {path:'',component:VendorDetailsComponent,
    children:[
      {path:'',redirectTo:'basic-details',pathMatch:'full'},
      {path:'basic-details',component:BasicDetailsComponent},
      {path:'bank-details',component:BankDetailsComponent},
      {path:'document-details',component:DocumentDetailsComponent},
      {path:'account-details',component:AccountDetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorDetailsRoutingModule { }
