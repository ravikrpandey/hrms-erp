import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyRemarksComponent } from './company-remarks.component';

const routes: Routes = [
  {path:'',component:CompanyRemarksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRemarksRoutingModule { }
