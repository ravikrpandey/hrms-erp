import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseBifurcationComponent } from './warehouse-bifurcation.component';
import { SetupWarehouseBifurcationComponent } from './setup-warehouse-bifurcation/setup-warehouse-bifurcation.component';
import { WarehouseDesignComponent } from './warehouse-design/warehouse-design.component';

const routes: Routes = [
  { path: '', component: WarehouseBifurcationComponent },
  { path: 'setup-warehouse-bifurcation', component: SetupWarehouseBifurcationComponent },
  { path: 'warehouse-design', component: WarehouseDesignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseBifurcationRoutingModule { }
