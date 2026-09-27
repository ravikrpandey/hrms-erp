import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Compliances } from './compliances';
import { HealthList } from './health-list/health-list';
import { HealthCreate } from './health-create/health-create';
import { SafetyList } from './safety-list/safety-list';
import { WelfareList } from './welfare-list/welfare-list';
import { SafetyCreate } from './safety-create/safety-create';
import { WelfareCreate } from './welfare-create/welfare-create';

const routes: Routes = [
  {
    path: "", component: Compliances,
    children: [
      {
        path: "health",
        component: HealthList
      },
      {
        path: "health/create", component: HealthCreate
      },
      { path: "safety", component: SafetyList },
      { path: "safety/create", component: SafetyCreate },
      { path: "welfare", component: WelfareList },
      { path: "welfare/create", component: WelfareCreate }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompliancesRoutingModule { }
