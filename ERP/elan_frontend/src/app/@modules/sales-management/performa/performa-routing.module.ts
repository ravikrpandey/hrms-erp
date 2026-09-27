import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformaComponent } from './performa.component';
import { CreateProformasComponent } from './create-proformas/create-proformas.component';
import { ApprovedProformasComponent } from './approved-proformas/approved-proformas.component';
import { RejectedProformasComponent } from './rejected-proformas/rejected-proformas.component';
import { PendingProformasComponent } from './pending-proformas/pending-proformas.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {path:'',component:PerformaComponent},
  {path:'create-proformas',component:CreateProformasComponent},
  {path:'create-proformas',component:CreateProformasComponent},
  {path:'approved-proformas',component:ApprovedProformasComponent},
  {path:'pending-proformas',component:PendingProformasComponent},
  {path:'rejected-proformas',component:RejectedProformasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes),MatIconModule],
  exports: [RouterModule]
})
export class PerformaRoutingModule { }
