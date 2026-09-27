import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockAcknowledgementComponent } from './stock-acknowledgement.component';

const routes: Routes = [{ path: '', component: StockAcknowledgementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockAcknowledgementRoutingModule { }
