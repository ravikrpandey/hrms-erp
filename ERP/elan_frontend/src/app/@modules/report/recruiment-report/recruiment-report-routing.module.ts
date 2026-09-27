import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruimentReportComponent } from './recruiment-report.component';

const routes: Routes = [
  {path:'',component:RecruimentReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruimentReportRoutingModule { }
