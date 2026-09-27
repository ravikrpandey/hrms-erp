import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProformaListComponent } from './proforma-list/proforma-list.component';

const routes: Routes = [
  {path:'',component:ProformaListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProformaInvoiceRoutingModule { }
