import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportRequestComponent } from './transport-request.component';
import { CreateTransportRequestComponent } from './create-transport-request/create-transport-request.component';
import { TransposrtRequestListComponent } from './transposrt-request-list/transposrt-request-list.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { ApprovedTransportRequestComponent } from './approved-transport-request/approved-transport-request.component';
import { RejectedTransportRequestComponent } from './rejected-transport-request/rejected-transport-request.component';

const routes: Routes = [
  {
    path: '',
    component: TransportRequestComponent,

    children: [
      {
        path: '', redirectTo: 'request-list', pathMatch: 'full'
      },
      { path: "request-list", component: TransposrtRequestListComponent },
      { path: "pending-request-list", component: PendingRequestComponent },
      { path: "approved-request-list", component: ApprovedTransportRequestComponent },
      { path: "rejected-request-list", component: RejectedTransportRequestComponent },
    ]
  },
  {
    path: 'add-new-request',
    component: CreateTransportRequestComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRequestRoutingModule { }
