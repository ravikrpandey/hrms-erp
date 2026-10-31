import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@auth/auth-material/auth.guard';
import { CandidateUploadDocComponent } from './@modules/recuitment-module/bgv/candidate-upload-doc/candidate-upload-doc.component';
import { NoInternetComponent } from './no-internet/no-internet';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./@auth/auth.module').then((m) => m.AuthModule),
  },
  // ✅ Missing comma added here
  { path: 'offline', component: NoInternetComponent },  
  {
    path: 'master',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./@modules/master.module').then((m) => m.MasterModule),
  },
  // {
  //   path: 'request-form',
  //   loadChildren: () =>
  //     import('../app/request/request.module').then((m) => m.RequestModule),
  // },

  // {
  //   path: 'send-rfp-link',
  //   loadChildren: () =>
  //     import('../app/send-rfp/send-rfp.module').then((m) => m.SendRfpModule),
  // },
  {
    path: 'customer-type',
    loadChildren: () =>
      import(
        './@modules/itticketing/configurationalmaster/customer-type/customer-type.module'
      ).then((m) => m.CustomerTypeModule),
  },
  {
    path: 'training-name',
    loadChildren: () =>
      import(
        './@modules/itticketing/configurationalmaster/training-name/training-name.module'
      ).then((m) => m.TrainingNameModule),
  },
  {
    path: 'level-slab',
    loadChildren: () =>
      import(
        './@modules/itticketing/configurationalmaster/level-slab/level-slab.module'
      ).then((m) => m.LevelSlabModule),
  },
  {
    path: 'pricing-level',
    loadChildren: () =>
      import(
        './@modules/itticketing/configurationalmaster/pricing-level/pricing-level.module'
      ).then((m) => m.PricingLevelModule),
  },

  // {
  //   path: 'receive-response',
  //   loadChildren: () =>
  //     import('./answering-form/answering-form.module').then(
  //       (m) => m.AnsweringFormModule
  //     ),
  // },

  // {
  //   path: 'response-confirmation',
  //   loadChildren: () =>
  //     import('./branching-form/branching-form.module').then(
  //       (m) => m.BranchingFormModule
  //     ),
  // },

  // {
  //   path: 'send-vendor',
  //   loadChildren: () =>
  //     import('./send-link-vendor/send-link-vendor.module').then(
  //       (m) => m.SendLinkVendorModule
  //     ),
  // },

  {
    path: 'create-employee-module',
    loadChildren: () =>
      import('./employee-master/employee-master.module').then((m) => m.EmployeeMasterModule),
  },

  {
    path: 'new-employee-form',
    loadChildren: () =>
      import('./new-employee-form/new-employee-form.module').then(
        (m) => m.NewEmployeeFormModule
      ),
  },
  {
    path: 'open-house-training',
    loadChildren: () =>
      import('./registration/registration.module').then((m) => m.RegistrationModule),
  },
  {
    path: 'send-negotiation-link',
    loadChildren: () =>
      import('./send-negotiate-link/send-negotiate-link.module').then((m) => m.SendNegotiateLinkModule),
  },
  {
    path: 'form-candidate/:id',
    loadChildren: () =>
      import('./candidate-form/candidate-form.module').then((m) => m.CandidateFormModule),
  },
  {
    path: 'company-remarks',
    loadChildren: () =>
      import('./company-remarks/company-remarks.module').then((m) => m.CompanyRemarksModule),
  },
  {
    path: 'candidate-offer-letter',
    loadChildren: () =>
      import('./candidate-offer-letter-receive/candidate-offer-letter-receive.module').then((m) => m.CandidateOfferLetterModule),
  },
  {
    path: 'candidate-upload-document', component: CandidateUploadDocComponent
  },
  {
    path: 'projects',
    redirectTo: 'master/project-management/projects',
    pathMatch: 'prefix'
  },
  {
    path: 'tasks',
    redirectTo: 'master/project-management/tasks',
    pathMatch: 'prefix'
  },
  {
    path: 'timesheet',
    redirectTo: 'master/project-management/timesheet',
    pathMatch: 'prefix'
  },
  {
    path: 'timesheets',
    redirectTo: 'master/project-management/timesheet',
    pathMatch: 'prefix'
  },
  {
    path: 'expenses',
    redirectTo: 'master/expense-management/expenses',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
