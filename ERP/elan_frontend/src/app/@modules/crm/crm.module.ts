import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CRMComponent } from './crm.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CRMRoutingModule } from './crm-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ActionLeadFormSetupComponent } from './pages/action/action-lead-form-setup/action-lead-form-setup.component';
import { CreateLeadComponent } from './pages/create-lead/create-lead.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ActionLeadFormSetupStatusComponent } from './pages/action/action-lead-form-setup-status/action-lead-form-setup-status.component';
import { ActionLeadFormSetupMandatoryComponent } from './pages/action/action-lead-form-setup-mandatory/action-lead-form-setup-mandatory.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeadFormSetupComponent } from './pages/lead-form-setup/lead-form-setup.component';
import { LeadStatusComponent } from './pages/lead-status/lead-status.component';
import { LeadDescriptionComponent } from './pages/lead-description/lead-description.component';
import { AddLeadFormSetupDialogComponent } from './pages/dialogs/add-lead-form-setup-dialog/add-lead-form-setup-dialog.component';
import { ViewLeadStatusDialogComponent } from './pages/dialogs/view-lead-status-dialog/view-lead-status-dialog.component';
import { CreateFieldValueComponent } from './pages/create-field-value/create-field-value.component';
import { ActionLeadStatusComponent } from './pages/action/action-lead-status/action-lead-status.component';
import { ViewLeadDescriptionDialogComponent } from './pages/dialogs/view-lead-description-dialog/view-lead-description-dialog.component';
import { LeadSummaryComponent } from './pages/lead-summary/lead-summary.component';
import { AssignUserComponent } from './pages/assign-user/assign-user/assign-user.component';
import { ActionAssignUserComponent } from './pages/assign-user/action-assign-user/action-assign-user.component';
import { AssignUserCreateComponent } from './pages/assign-user/assign-user-create/assign-user-create.component';
import { AssignUserModule } from './assign-user/assign-user.module';
import { CreateProposalComponent } from './pages/proposal/create-proposal/create-proposal.component';
import { AssignProposalDialogComponent } from './pages/proposal/dialogs/assign-proposal-dialog/assign-proposal-dialog.component';
import { DiscountRequestComponent } from './pages/proposal/discount-request/discount-request.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClosedDealsComponent } from './pages/proposal/closed-deals/closed-deals.component';
import { PaymentProposalComponent } from './pages/proposal/payment-proposal/payment-proposal.component';
import { AllProposalComponent } from './pages/proposal/all-proposal/all-proposal.component';
import { ViewProposalVersionDialogComponent } from './pages/proposal/dialogs/view-proposal-version-dialog/view-proposal-version-dialog.component';
import { ActionViewProposalVersionComponent } from './pages/proposal/action-proposal/action-view-proposal-version/action-view-proposal-version.component';
import { CloseDealDialogComponent } from './pages/dialogs/close-deal-dialog/close-deal-dialog.component';
import { OnlyNumberDirective } from 'src/app/@shared/directives/only-number.directive';
import { OnlyAlphabetDirective } from 'src/app/@shared/directives/only-alphabet.directive';
import { CreateLeadComponent2 } from './pages/create-lead copy/create-lead.component';
import { DashboardPageModule } from './dashboard-page/dashboard-page.module';
import { CrmDashboardComponent } from './pages/crm-dashboard/crm-dashboard.component';
import { LeadSourceChartComponent } from './pages/crm-dashboard/lead-source-chart/lead-source-chart.component';
import { ConversionRateChartComponent } from './pages/crm-dashboard/conversion-rate-chart/conversion-rate-chart.component';
import { SchemeDialogComponent } from './pages/proposal/scheme-dialog/scheme-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CreateProposalNewComponent } from './pages/proposal/create-proposal-new/create-proposal.component';
import { ProposalStatusDialogComponent } from './pages/proposal/dialogs/proposal-status-dialog/proposal-status-dialog.component';
import { SendPiLinkComponent } from 'src/app/send-pi-link/send-pi-link.component';
import { ScheduleProposalVersionComponent } from './pages/proposal/dialogs/schedule-proposal-version/schedule-proposal-version.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PreviewQuotationComponent } from './pages/proposal/preview-quotation/preview-quotation.component';
import { QuotationCalculationComponent } from './pages/proposal/dialogs/quotation-calculation/quotation-calculation.component';
import { CreateNewCustomerComponent } from './pages/proposal/create-proposal/create-new-customer/create-new-customer.component';
import { SoForwordDialogComponent } from './pages/proposal/create-proposal/so-forword-dialog/so-forword-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/@shared/shared.module';
import { UploadDocumentsComponent } from './pages/proposal/dialogs/upload-documents/upload-documents.component';
import { InstallationKitBomProposalComponent } from './pages/proposal/dialogs/installation-kit-bom-proposal/installation-kit-bom-proposal.component';
import { ManageAdvanceComponent } from './pages/proposal/dialogs/manage-advance/manage-advance.component';

@NgModule({
  declarations: [
    CreateProposalNewComponent,
    CRMComponent,
    DashboardComponent,
    LeadFormSetupComponent,
    ActionLeadFormSetupComponent,
    CreateLeadComponent,
    LeadStatusComponent,
    LeadDescriptionComponent,
    ActionLeadFormSetupStatusComponent,
    ActionLeadFormSetupMandatoryComponent,
    AddLeadFormSetupDialogComponent,
    ViewLeadStatusDialogComponent,
    CreateFieldValueComponent,
    ActionLeadStatusComponent,
    ViewLeadDescriptionDialogComponent,
    LeadSummaryComponent,
    AssignUserComponent,
    ActionAssignUserComponent,
    AssignUserCreateComponent,
    CreateProposalComponent,
    AssignProposalDialogComponent,
    DiscountRequestComponent,
    ClosedDealsComponent,
    PaymentProposalComponent,
    AllProposalComponent,
    ViewProposalVersionDialogComponent,
    ActionViewProposalVersionComponent,
    CloseDealDialogComponent,
    OnlyNumberDirective,
    OnlyAlphabetDirective,
    CreateLeadComponent2,
    CrmDashboardComponent,
    LeadSourceChartComponent,
    ConversionRateChartComponent,
    SchemeDialogComponent,
    ProposalStatusDialogComponent,
    SendPiLinkComponent,
    ScheduleProposalVersionComponent,
    PreviewQuotationComponent,
    QuotationCalculationComponent,
    CreateNewCustomerComponent,
    SoForwordDialogComponent,
    UploadDocumentsComponent,
    InstallationKitBomProposalComponent,
    ManageAdvanceComponent,
    
  ],
  imports: [
    CommonModule,
    CRMRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    CKEditorModule,
    AssignUserModule,
    MatSelectFilterModule,
    MatTabsModule,
    DashboardPageModule,
    NgxMatSelectSearchModule,
    SharedModule
  ],
  exports:[
    CreateProposalComponent,
    PreviewQuotationComponent,
    
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CRMModule {}
