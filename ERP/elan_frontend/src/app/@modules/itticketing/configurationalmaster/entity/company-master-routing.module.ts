import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterComponent } from './company-master.component';
import { AddCompanyComponent } from './add-company/add-company.component';

const routes: Routes = [
  {
    path:'',component:CompanyMasterComponent
  },
  {
    path:'add-company',component:AddCompanyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyMasterRoutingModule { }
