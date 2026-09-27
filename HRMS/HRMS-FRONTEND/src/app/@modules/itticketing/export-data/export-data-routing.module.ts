import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportDataComponent } from './export-data.component';

const routes: Routes = [

  { path: '', component: ExportDataComponent },
  {
    path: 'export-data-open',
    loadChildren: () => import('./export/export.module').then(m => m.ExportModule),
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule { }
