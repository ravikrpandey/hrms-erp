import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignCompOffComponent } from './assign-comp-off/assign-comp-off.component';
import { AssignCompOffListComponent } from './assign-comp-off-list/assign-comp-off-list.component';
import { CompOffFormComponent } from './comp-off-form/comp-off-form.component';


const routes: Routes = [
  {
    path: '',
    component: AssignCompOffComponent,
    children: [
      {
        path: 'assign-comp-off',
        component: AssignCompOffListComponent,
      },
      {
        path: 'add',
        component: CompOffFormComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignCompOffRoutingModule {}
