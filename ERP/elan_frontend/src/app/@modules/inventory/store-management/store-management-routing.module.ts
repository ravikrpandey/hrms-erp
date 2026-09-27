import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreManagementComponent } from './store-management.component';
import { StoreManagementListComponent } from './store-management-list/store-management-list.component';

const routes: Routes = [
  {
    path:'', component:StoreManagementComponent,
    children:[
      {
        path: '', redirectTo: 'store-management-list', pathMatch: 'full'
      },
      {
        path: 'store-management-list',
        component: StoreManagementListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreManagementRoutingModule { }
