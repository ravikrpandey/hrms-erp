import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubtypeComponent } from './subtype.component';
import { AddSubtypeComponent } from './add-subtype/add-subtype.component';
import { ViewSubtypeComponent } from './view-subtype/view-subtype.component';

const routes: Routes = [
  { path: '', component: SubtypeComponent },
  { path: 'add-subtype', component: AddSubtypeComponent },
  { path: 'view-subtype', component: ViewSubtypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubtypeRoutingModule { }
