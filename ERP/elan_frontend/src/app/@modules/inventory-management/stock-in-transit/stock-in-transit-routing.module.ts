import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockInTransitComponent } from './stock-in-transit.component';

const routes: Routes = [{ path: '', component: StockInTransitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockInTransitRoutingModule { }
