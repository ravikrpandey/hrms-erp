import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStoreComponent } from './create-store/create-store.component';
import { StoreComponent } from './store.component';

const routes: Routes = [
  {path:'',component:StoreComponent},
  {path:'create-warehouse',component:CreateStoreComponent},
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
