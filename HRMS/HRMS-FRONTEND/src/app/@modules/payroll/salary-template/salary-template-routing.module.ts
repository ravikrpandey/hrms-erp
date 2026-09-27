import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryTemplateListComponent } from './salary-template-list/salary-template-list.component';
import { SalaryTemplateCreateComponent } from './salary-template-create/salary-template-create.component';
import { SalaryTemplateViewComponent } from './salary-template-view/salary-template-view.component';

const routes: Routes = [
  {path:'', component:SalaryTemplateListComponent},
  {path:'create-template',component:SalaryTemplateCreateComponent},
  {path:'template-view',component:SalaryTemplateViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryTemplateRoutingModule { }
