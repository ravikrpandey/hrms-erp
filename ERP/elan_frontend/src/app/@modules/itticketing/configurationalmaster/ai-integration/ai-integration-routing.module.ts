import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { aiIntegrationComponent } from './ai-integration.component'

const routes: Routes = [
  {path:'' ,component:aiIntegrationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class aiIntegrationRoutingModule { }
