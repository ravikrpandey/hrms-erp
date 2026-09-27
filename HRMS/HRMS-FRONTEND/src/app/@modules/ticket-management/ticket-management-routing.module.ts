import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllocatedTicketsComponent } from './allocated-tickets/allocated-tickets.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketMangmentComponent } from './ticket-mangment/ticket-mangment.component';

const routes: Routes = [
  {
    path: '',
    component: TicketMangmentComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'allocated-ticket', component: AllocatedTicketsComponent },
      { path: 'ticket-list', component: TicketListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketManagementRoutingModule {}
