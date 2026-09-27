import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelSlabComponent } from './level-slab.component';

const routes: Routes = [{ path: '', component: LevelSlabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelSlabRoutingModule { }
