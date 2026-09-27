import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeductionListComponent } from './deduction-list/deduction-list.component';
import { DeductionCreateComponent } from './deduction-create/deduction-create.component';

const routes: Routes = [
  {path:'', component:DeductionListComponent},
  {path:'deduction-create', component:DeductionCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeductionsRoutingModule { }
