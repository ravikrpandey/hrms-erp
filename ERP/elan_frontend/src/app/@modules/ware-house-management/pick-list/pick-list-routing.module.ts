import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickListComponent } from './pick-list.component';
import { InvoiceViewComponent } from '../../sales/invoice/invoice-view/invoice-view.component';

const routes: Routes = [{ path: '', component: PickListComponent },
{path:'invoice-view',component:InvoiceViewComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickListRoutingModule { }
