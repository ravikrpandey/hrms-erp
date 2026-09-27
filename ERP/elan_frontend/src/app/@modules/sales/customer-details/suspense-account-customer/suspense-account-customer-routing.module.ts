import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuspenseAccountListComponent } from './suspense-account-list/suspense-account-list.component';
import { AddSuspenseAccountComponent } from './add-suspense-account/add-suspense-account.component';

const routes: Routes = [

  {
    path: '',
    component: SuspenseAccountListComponent,
  },
    {
      path: 'add-suspense-account',
      component: AddSuspenseAccountComponent
    }
  ,

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuspenseAccountCustomerRoutingModule {}