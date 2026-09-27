import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftAllocationComponent } from './shift-allocation/shift-allocation.component';
import { ShiftAllocationListComponent } from './shift-allocation-list/shift-allocation-list.component';
const routes: Routes = [
  { path: '', component: ShiftAllocationListComponent },
  { path: 'add', component: ShiftAllocationComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftAllocationRoutingModule {}
