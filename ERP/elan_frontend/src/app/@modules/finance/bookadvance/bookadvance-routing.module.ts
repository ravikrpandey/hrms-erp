import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookadvanceComponent } from './bookadvance.component';

const routes: Routes = [
  {path:'',redirectTo:"advance-booking-list",pathMatch:'full'},
  {path:'advance-booking-list',component:BookadvanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookadvanceRoutingModule { }
