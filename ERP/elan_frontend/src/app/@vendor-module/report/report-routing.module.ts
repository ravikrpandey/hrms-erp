import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';

const routes: Routes = [
  {path:'',component:ReportComponent,
    children:[
      {
        path:'recruitment-report',
        loadChildren:()=>import('./recruitment-report/recruitment-report.module').then(m=>m.RecruitmentReportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
