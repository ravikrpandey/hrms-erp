import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AchievementFormComponent } from './achievement-form/achievement-form.component';
import { EmployeeMasterComponent } from './employee-master.component';

const routes: Routes = [
  {
    path: 'employ',
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  {
    path: 'on-boarding-employ',
    loadChildren: () =>
      import('./employee/on-boarding-emp-list/on-boarding-emp-list.module').then((m) => m.OnBoardingEmpListModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeMasterRoutingModule {}
