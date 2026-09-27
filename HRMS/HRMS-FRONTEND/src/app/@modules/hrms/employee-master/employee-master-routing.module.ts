import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AchievementFormComponent } from './achievement-form/achievement-form.component';
import { EmployeeMasterComponent } from './employee-master.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: 'employ',
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  { path: 'employee-digital-signature', 
    loadChildren: () => 
      import('./emp-digital-signature/emp-digital-signature.module').then(m => m.EmpDigitalSignatureModule) 
  },
  { 
    path: 'digital-signature-approver',
     loadChildren: () => import('./digital-signature-approval/digital-signature-approval.module').then(m => m.DigitalSignatureApprovalModule) 
  },
  {
    path: 'on-boarding-employ',
    loadChildren: () =>
      import('./employee/on-boarding-emp-list/on-boarding-emp-list.module').then((m) => m.OnBoardingEmpListModule),
  },
  {
    path: 'employee-list',
    loadChildren: () =>
      import('./employee-list/employee-list.module').then((m) => m.EmployeeListModule),
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeMasterRoutingModule {}
