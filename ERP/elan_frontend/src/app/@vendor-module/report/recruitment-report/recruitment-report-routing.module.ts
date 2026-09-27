import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentReportComponent } from './recruitment-report.component';

const routes: Routes = [
  {path:'',component:RecruitmentReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentReportRoutingModule { }
