import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantMasterListComponent } from './plant-master-list/plant-master-list.component';
import { PlantMasterCreateComponent } from './plant-master-create/plant-master-create.component';
import { PlantMasterViewComponent } from './plant-master-view/plant-master-view.component';

const routes: Routes = [
  {path: '', component: PlantMasterListComponent},
  {path: 'create', component: PlantMasterCreateComponent},
  {path: 'view', component: PlantMasterViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantMasterRoutingModule { }
