import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LorryReceiptComponent } from './lorry-receipt.component';

const routes: Routes = [{ path: '', component: LorryReceiptComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LorryReceiptRoutingModule { }
