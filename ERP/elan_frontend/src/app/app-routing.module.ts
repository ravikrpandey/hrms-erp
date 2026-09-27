import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@auth/auth-material/auth.guard';
import { AccessDeniedComponent } from './@shared/components/access-denied/access-denied.component';
import { SendPiLinkComponent } from './send-pi-link/send-pi-link.component';
import { VhTransporterRequestLinkComponent } from './@modules/ware-house-management/vehicle-planning/vh-transporter-request-link/vh-transporter-request-link.component';
import { VhTransporterResponseComponent } from './@modules/ware-house-management/vehicle-planning/vh-transporter-response/vh-transporter-response.component';
import { VendorShippingAlertComponent } from './@modules/purchase-management/shipping-alert/vendor-shipping-alert/vendor-shipping-alert.component';
import { VendorDashboardComponent } from './@modules/purchase-management/shipping-alert/vendor-dashboard/vendor-dashboard.component';
import { VendorPolistComponent } from './@modules/purchase-management/shipping-alert/vendor-polist/vendor-polist.component';
import { VendorShippingTrackingDetailsComponent } from './@modules/purchase-management/shipping-alert/vendor-shipping-tracking-details/vendor-shipping-tracking-details.component';
import { CustomerPortalComponent } from './@modules/sales/customer-portal/customer-portal.component';
import { CustomerSoListComponent } from './@modules/sales/customer-portal/customer-so-list/customer-so-list.component';
import { VendorRfplistComponent } from './@modules/purchase-management/shipping-alert/vendor-rfplist/vendor-rfplist.component';
import { VendorNegotiationlistComponent } from './@modules/purchase-management/shipping-alert/vendor-negotiationlist/vendor-negotiationlist.component';
import { CustomerSbListComponent } from './@modules/sales/customer-portal/customer-sb-list/customer-sb-list.component';
import { CustomerAccountsComponent } from './@modules/sales/customer-portal/customer-accounts/customer-accounts.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../app/@auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('../app/@modules/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'create-employee-module',
    loadChildren: () =>
      import('../app/employee-master/employee-master.module').then(
        (m) => m.EmployeeMasterModule
      ),
  },
  // {
  //   path: 'request-form',
  //   loadChildren: () =>
  //     import('../app/request/request.module').then((m) => m.RequestModule),
  // },
  {
    path: 'send-rfp-link',
    loadChildren: () =>
      import('../app/send-rfp/send-rfp.module').then((m) => m.SendRfpModule),
  },
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
    path: 'new-employee-form',
    loadChildren: () =>
      import('./new-employee-form/new-employee-form.module').then(
        (m) => m.NewEmployeeFormModule
      ),
  },
  {
    path: 'open-house-training',
    loadChildren: () =>
      import('../app/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
  },
  {
    path: 'send-negotiation-link',
    loadChildren: () =>
      import('../app/send-negotiate-link/send-negotiate-link.module').then(
        (m) => m.SendNegotiateLinkModule
      ),
  },
  {
    path: 'form-candidate/:id',
    loadChildren: () =>
      import('../app/candidate-form/candidate-form.module').then(
        (m) => m.CandidateFormModule
      ),
  },
  {
    path: 'company-remarks',
    loadChildren: () =>
      import('../app/company-remarks/company-remarks.module').then(
        (m) => m.CompanyRemarksModule
      ),
  },
  {
    path: 'candidate-offer-letter',
    loadChildren: () =>
      import(
        './candidate-offer-letter-receive/candidate-offer-letter-receive.module'
      ).then((m) => m.CandidateOfferLetterModule),
  },
  {
    path: 'vendor',
    loadChildren: () =>
      import('./@vendor-module/vendor-module.module').then(
        (m) => m.VendorModuleModule
      ),
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'send-pi-link', component: SendPiLinkComponent },
  { path: 'transporter-request-link', component: VhTransporterRequestLinkComponent },
  { path: 'transporter-response', component: VhTransporterResponseComponent },
  // { path: 'error', loadChildren: () => import('./error-page/error-page.module').then(m => m.ErrorPageModule) },
  { path: 'vendor-dashboard', component:VendorDashboardComponent},
  { path: 'vendor-polist', component:VendorPolistComponent},
  { path: 'vendor-rfplist', component:VendorRfplistComponent},
  { path: 'vendor-negotiationlist', component:VendorNegotiationlistComponent},
  { path: 'vendor-return-list', loadChildren: () => import('./@modules/purchase-management/purchase-return/purchase-return.module').then(m => m.PurchaseReturnModule) },
  { path: 'approved-shipping-alert' ,component:VendorShippingAlertComponent},
  { path: 'vendor-tracking-alert' ,component:VendorShippingTrackingDetailsComponent},
  { path: 'customer-portal', component:CustomerPortalComponent},
  { path: 'customer-so-list', component:CustomerSoListComponent},
  { path: 'customer-sb-list', component:CustomerSbListComponent},
  { path: 'customer-accounts', component:CustomerAccountsComponent},
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
