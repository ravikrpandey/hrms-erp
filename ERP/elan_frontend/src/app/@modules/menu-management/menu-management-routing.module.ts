import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuManagementComponent } from './menu-management.component';
import { ListingMenuComponent } from './listing-menu/listing-menu.component';

const routes: Routes = [
  {path:'',component:MenuManagementComponent,
    children:[
      {
        path:'menu-listing',
        component: ListingMenuComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuManagementRoutingModule { }
