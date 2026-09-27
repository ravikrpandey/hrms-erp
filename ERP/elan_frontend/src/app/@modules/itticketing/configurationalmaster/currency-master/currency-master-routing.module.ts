import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyMasterComponent } from './currency-master.component';

const routes: Routes = [{ path: '', component: CurrencyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyMasterRoutingModule { }
