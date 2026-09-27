import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnComponent } from './grn.component';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { GenerateGrnMultiPoComponent } from './generate-grn-multi-po/generate-grn-multi-po.component';

const routes: Routes = [
  { path: '', component: GrnComponent },
  { path: 'create-grn', component: CreateGrnComponent },
  { path: 'genrate-grn-multi-po', component: GenerateGrnMultiPoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrnRoutingModule { }
