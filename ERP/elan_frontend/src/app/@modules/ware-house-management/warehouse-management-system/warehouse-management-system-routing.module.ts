import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseManagementSystemComponent } from './warehouse-management-system.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { WarebifurcationNewComponent } from './warebifurcation-new/warebifurcation-new.component';
import { WarehouseDesignComponent } from './warehouse-design/warehouse-design.component';
import { RecievingItemsComponent } from './recieving-items/recieving-items.component';
import { WarehouseItemsComponent } from './warehouse-items/warehouse-items.component';

const routes: Routes = [
  {path:'',component:WarehouseManagementSystemComponent},
  {path: 'view-details',component: ViewDetailsComponent},
  {path: 'warehouse-new-bircation',component: WarebifurcationNewComponent},
  {path: 'warehouse-design',component: WarehouseDesignComponent},
  {
    path:'recieving-items',component:RecievingItemsComponent
  },
  {
    path:'warehouse-items',component:WarehouseItemsComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseManagementSystemRoutingModule { }
