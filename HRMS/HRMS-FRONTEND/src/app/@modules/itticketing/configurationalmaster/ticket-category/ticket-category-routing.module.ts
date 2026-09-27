import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketCategoryComponent } from './ticket-category.component';
const routes: Routes = [
  {path:'',component:TicketCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketCategoryRoutingModule { }
