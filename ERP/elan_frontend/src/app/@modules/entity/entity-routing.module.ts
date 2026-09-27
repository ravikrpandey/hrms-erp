import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityComponent } from './entity.component';
import { AddEntityComponent } from './add-entity/add-entity.component';
import { EntityListComponent } from './entity-list/entity-list.component';

const routes: Routes = [
  {
    path: '',
    component: EntityComponent,
    children: [
      {
        path:'entity-list',component:EntityListComponent
      },
      {
        path:'add-entity',component:AddEntityComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
