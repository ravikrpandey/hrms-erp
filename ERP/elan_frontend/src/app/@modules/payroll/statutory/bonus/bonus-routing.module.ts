import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonusListComponent } from './bonus-list/bonus-list.component';
import { BonusCreateComponent } from './bonus-create/bonus-create.component';

const routes: Routes = [
  {path:'', component:BonusListComponent},
  {path:'statutory-bonus-create', component:BonusCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusRoutingModule { }
