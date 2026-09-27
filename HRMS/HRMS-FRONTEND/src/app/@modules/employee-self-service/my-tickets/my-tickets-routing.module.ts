import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTicketsComponent } from './my-tickets.component';
import { CreateMyTicketComponent } from './myticket/create-my-ticket/create-my-ticket.component';
import { CreateAllocatedTicketComponent } from './create-allocated-ticket/create-allocated-ticket.component';


const routes: Routes = [
  {path:'',component:MyTicketsComponent},
  {path:'create-my-ticket',component : CreateMyTicketComponent},
  {path : 'create-allocate-ticket' ,component : CreateAllocatedTicketComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTicketsRoutingModule { }
