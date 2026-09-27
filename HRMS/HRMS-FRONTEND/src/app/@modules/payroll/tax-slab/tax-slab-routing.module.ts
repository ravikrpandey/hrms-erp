import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxSlabListComponent } from './tax-slab-list/tax-slab-list.component';
import { TaxSlabCreateComponent } from './tax-slab-create/tax-slab-create.component';

const routes: Routes = [
  {path:'', component:TaxSlabListComponent},
  {path:'create-template',component:TaxSlabCreateComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxSlabRoutingModule { }
