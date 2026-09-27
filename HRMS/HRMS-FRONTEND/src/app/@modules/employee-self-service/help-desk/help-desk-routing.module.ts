import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskCreateComponent } from './help-desk-create/help-desk-create.component';
import { HelpDeskListComponent } from './help-desk-list/help-desk-list.component';

const routes: Routes = [
  {path:'', component:HelpDeskListComponent},
  {path:'help-disk-create', component:HelpDeskCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskRoutingModule { }
