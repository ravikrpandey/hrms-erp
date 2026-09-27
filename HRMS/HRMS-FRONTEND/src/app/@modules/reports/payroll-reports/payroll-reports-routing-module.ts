import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from '../../payroll/payroll.component';
import { PayRegister } from './pay-register/pay-register';
import { AdvanceRegister } from './advance-register/advance-register';
import { DeductionRegister } from './deduction-register/deduction-register';
import { EmployeeExpenses } from './employee-expenses/employee-expenses';
import { EqualRemuneration } from './equal-remuneration/equal-remuneration';
import { Esic } from './esic/esic';
import { FineRegister } from './fine-register/fine-register';
import { LeaveRegister } from './leave-register/leave-register';
import { MusterRoll } from './muster-roll/muster-roll';
import { OvertimeRegister } from './overtime-register/overtime-register';
import { PfEcr } from './pf-ecr/pf-ecr';
import { RegisterOfEmployee } from './register-of-employee/register-of-employee';
import { RegisterOfWorkman } from './register-of-workman/register-of-workman';
import { Reimbursement } from './reimbursement/reimbursement';
import { WageRegister } from './wage-register/wage-register';
import { StatutoryComponent } from '../../payroll/statutory/statutory/statutory.component';
import { StatutoryReports } from './statutory-reports/statutory-reports';
import { LabourWelfareReport } from './labour-welfare-fund-reports/labour-welfare-fund-reports';
import { NpsReports } from './nps-reports/nps-reports';
import { EdliReports } from './edli-reports/edli-reports';
import { BonusReports } from './bonus-reports/bonus-reports';
import { LeaveEncashmentReports } from './leave-encashment-reports/leave-encashment-reports';
import { AdhocDeductionReports } from './adhoc-deduction-reports/adhoc-deduction-reports';
import { SafReports } from './saf-reports/saf-reports';
import { PtReports } from './pt-reports/pt-reports';
import { TdsReports } from './tds-reports/tds-reports';
import { IncentiveReports } from './incentive-reports/incentive-reports';

const routes: Routes = [
  {
    path: 'pay-register',
    component: PayRegister,
  },
  {
    path: 'advance-register',
    component: AdvanceRegister,
  },
  {
    path: 'deduction-register',
    component: DeductionRegister,
  },
  {
    path: 'employee-expenses',
    component: EmployeeExpenses,
  },
  {
    path: 'equal-remuneration',
    component: EqualRemuneration,
  },
  {
    path: 'esic',
    component: Esic,
  },
  {
    path: 'fine-register',
    component: FineRegister,
  },
  {
    path: 'leave-register',
    component: LeaveRegister,
  },
  {
    path: 'muster-roll',
    component: MusterRoll,
  },
  {
    path: 'overtime-register',
    component: OvertimeRegister,
  },
  {
    path: 'pf-ecr',
    component: PfEcr,
  },
  {
    path: 'register-of-employee',
    component: RegisterOfEmployee,
  },
  {
    path: 'register-of-workman',
    component: RegisterOfWorkman,
  },
  {
    path: 'reimbursement',
    component: Reimbursement,
  },
  {
    path: 'wage-register',
    component: WageRegister,
  },
  {
    path: 'statutory-reports',
    component:StatutoryReports,
  },
  {
    path: 'labour-welfare-fund',
    component:LabourWelfareReport,
  },
  {
    path: 'nps-reports',
    component:NpsReports,
  },
  {
    path: 'edli-reports',
    component:EdliReports,
  },
  {
    path: 'bonus-reports',
    component:BonusReports,
  },
  {
    path: 'leave-encashment-reports',
    component:LeaveEncashmentReports,
  },
  {
    path: 'adhoc-reports',
    component:AdhocDeductionReports,
  },
  {
    path: 'pt-reports',
    component:PtReports,
  },
  {
    path: 'saf-reports',
    component:SafReports,
  },
  {
    path: 'tds-reports',
    component:TdsReports,
  },
  {
    path: 'incentive-reports',
    component:IncentiveReports,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollReportsRoutingModule {}
