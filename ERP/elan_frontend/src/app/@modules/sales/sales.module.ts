import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { QuotationComponent } from './quotation/quotation.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material/datepicker';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { QuotationActionComponent } from './quotation/quotation-action/quotation-action.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ExistingCustomerComponent } from './customer-list/existing-customer/existing-customer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CKEditorModule } from 'ckeditor4-angular';
import { ProductionListComponent } from './production-list/production-list.component';
import { SendEmailComponent } from './production-list/send-email/send-email.component';
import { SalesOrderActionComponent } from './production-list/sales-order-action/sales-order-action.component';
import { MatButtonModule } from '@angular/material/button';
import { AddDoComponent } from './production-list/add-do/add-do.component';
import { ViewOrderComponent } from './production-list/view-order/view-order.component';
import { DOHistoryComponent } from './production-list/do-history/do-history.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { RevenueTrendChartComponent } from './sales-dashboard/revenue-trend-chart/revenue-trend-chart.component';
import { TeamPerformenceComponent } from './sales-dashboard/team-performence/team-performence.component';
import { ProductSaleComponent } from './sales-dashboard/product-sale/product-sale.component';
import { RevenueForcastComponent } from './sales-dashboard/revenue-forcast/revenue-forcast.component';
import { SalesInvoiceListComponent } from './sales-invoice/sales-invoice-list/sales-invoice-list.component';
import { CreateSalesInvoiceComponent } from './sales-invoice/create-sales-invoice/create-sales-invoice.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { DeliveryChallanListComponent } from './delivery-challan-list/delivery-challan-list.component';
import { CreateDeliveryChallanComponent } from './create-delivery-challan/create-delivery-challan.component';
import { CustomerActionComponent } from './customer-list/customer-action/customer-action.component';

import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApprovedSalesInvoiceListComponent } from './sales-invoice/approved-sales-invoice-list/approved-sales-invoice-list.component';
import { SalesInvoiceAction } from './sales-invoice/sales-invoice-action/sales-invoice-action.component';
import { AllDoList } from './delivery-order-management/all-do-list/all-do-list.component';
import { EWayList } from './delivery-order-management/e-way-do-list/e-way-do-list.component';
import { DoAction } from './delivery-order-management/do-action/do-action.component';
import { GenerateIRN } from './delivery-order-management/generateIrn/generate-irn.component';
import { viewInvoiceIrn } from './sales-invoice/view-invoice-irn-dialog/view-invoice-irn.component';
import { GenerateEwayComponent } from './sales-invoice/generate-eway/generate-eway.component';
import { ViewEwayChallanComponent } from './delivery-order-management/e-way-do-list/view-eway-challan/view-eway-challan.component';
import { EWayActionComponent } from './delivery-order-management/e-way-do-list/e-way-action/e-way-action.component';
import { EWayDialogComponent } from './delivery-order-management/e-way-do-list/e-way-dialog/e-way-dialog.component';
import { CreateDirectDeliveryChallanComponent } from './create-direct-delivery-challan/create-direct-delivery-challan.component';
import { CreateDirectEwayComponent } from './create-direct-eway/create-direct-eway.component';
import { CreateDirectInvoiceComponent } from './sales-invoice/create-direct-invoice/create-direct-invoice.component';
import { CustomerTreeViewComponent } from './customer-list/customer-tree-view/customer-tree-view.component';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ViewDeliveryChallanComponent } from './production-list/view-delivery-challan/view-delivery-challan.component';
import { MatChipsModule } from '@angular/material/chips';
import { CustomerPortalComponent } from './customer-portal/customer-portal.component';
import { CustomerHeaderComponent } from './customer-portal/customer-header/customer-header.component';
import { CustomerSoListComponent } from './customer-portal/customer-so-list/customer-so-list.component';
import { CustomerAgingReportComponent } from './customer-aging-report/customer-aging-report.component';
import { CustomerAgingListComponent } from './customer-aging-report/customer-aging-list/customer-aging-list.component';
import { CollectionReportsComponent } from './collection-reports/collection-reports.component';
import { CustomerSbListComponent } from './customer-portal/customer-sb-list/customer-sb-list.component';
import { CustomerAccountsComponent } from './customer-portal/customer-accounts/customer-accounts.component';
import { CustomerSbActionComponent } from './customer-portal/customer-sb-action/customer-sb-action.component';


// import { SidebarMenuComponent } from 'src/app/@shared/sidebar-menu/sidebar-menu.component';

@NgModule({
  declarations: [
    SalesComponent,
    SalesComponent,
    QuotationComponent,
    QuotationActionComponent,
    CustomerListComponent,
    ExistingCustomerComponent,
    ProductionListComponent,
    SendEmailComponent,
    SalesOrderActionComponent,
    AddDoComponent,
    ViewOrderComponent,
    DOHistoryComponent,
    SalesDashboardComponent,
    RevenueTrendChartComponent,
    TeamPerformenceComponent,
    ProductSaleComponent,
    RevenueForcastComponent,
    SalesInvoiceListComponent,
    ApprovedSalesInvoiceListComponent,
    SalesInvoiceAction,
    CreateSalesInvoiceComponent,
    DeliveryChallanListComponent,
    CreateDeliveryChallanComponent,
    // SidebarMenuComponent
    CustomerActionComponent,
    AllDoList,
    GenerateIRN,
    EWayList,
    DoAction,
    viewInvoiceIrn,
    GenerateEwayComponent,
    ViewEwayChallanComponent,
    EWayActionComponent,
    EWayDialogComponent,
    CreateDirectDeliveryChallanComponent,
    CreateDirectEwayComponent,
    CreateDirectInvoiceComponent,
    CustomerTreeViewComponent,
    ProspectListComponent,
    ViewDeliveryChallanComponent,
    CustomerPortalComponent,
    CustomerHeaderComponent,
    CustomerSoListComponent,
    CustomerAgingReportComponent,
    CustomerAgingListComponent,
    CollectionReportsComponent,
    CustomerSbListComponent,
    CustomerAccountsComponent,
    CustomerSbActionComponent,
    



  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    ShairedModule,
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
    MaterialModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectFilterModule,
    MatChipsModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  
})
export class SalesModule { }
