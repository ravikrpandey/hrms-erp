import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentNameComponent } from './component-name/component-name.component';
import { CRMComponent } from '../crm.component';

const routes: Routes = [
  {
    path: '', component: CRMComponent,
    children: [
      {
        path: 'component-name',
        component: ComponentNameComponent
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignUserRouting { }
