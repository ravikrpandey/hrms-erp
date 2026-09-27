import { Component, OnInit } from '@angular/core';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SalesService } from '../../service/sales.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.scss']
})
export class CustomerAccountsComponent implements OnInit {

  login_id: any;
  login_id_header: any;

  profileData: any = null;
  profileLoading = true;
  profileLoaded = false;

  contactPersons: any;
  addresses: any = {
    billingAaddress: [],
    shippingAddress: []
  };

  addressesLoading = false;
  addressesLoaded = true;

  creditLimitData: any;

  // Separate grid APIs for each grid
  private invoiceGridApi!: GridApi<any>;
  private advanceGridApi!: GridApi<any>;
  
  invoiceList: any = [];
  creditLimitLoading = false;
  creditLimitLoaded = true;
  advanceLoading: boolean = false;
  advancePaymentData: any[] = [];
  totalCashAmount: number = 0;
  chequeTotalAmount: number = 0;

  constructor(
    private empService: EmpRegistrationService, 
    private cryptoService: CryptoService, 
    private salesService: SalesService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.login_id_header = loginData.loginID;
    this.login_id = this.cryptoService.decrypt(this.login_id_header);
  }

  onCustomerDetails(data: any): void {
    if (data) {
      this.profileData = data;
      this.profileLoaded = true;
      this.profileLoading = false;
      this.getContactAddresses();
    } else {
      this.profileData = null;
      this.profileLoaded = false;
      this.profileLoading = false;
    }
  }

  onCreditLimitDetails(data: any): void {
    if (data) {
      this.creditLimitData = data;
    } else {
      this.creditLimitData = null;
    }
  }

  getContactAddresses(): void {
    this.empService.getCustomerContactAddress(this.profileData.id).subscribe({
      next: (res: any) => {
        this.contactPersons = res?.data.contactPersons;
        this.addresses = {
          billingAaddress: res?.data?.billingAaddress || [],
          shippingAddress: res?.data?.shippingAddress || []
        };
        this.addressesLoading = false;
        this.addressesLoaded = true;
      },
      error: (err: any) => {
        this.contactPersons = [];
        this.addresses = {
          billingAaddress: [],
          shippingAddress: []
        };
        this.addressesLoading = false;
        this.addressesLoaded = false;
      },
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        // Profile already loaded from Header
        break;
      case 1:
        // Addresses already loaded with Profile
        break;
      case 2:
        this.getCreditLimitHistory();
        break;
      case 3:
        this.getCustomerAdvanceHistory();
        break;
    }
  }

  // Column definitions for Invoice grid
  public invoiceColumnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5
    },
    {
      headerName: 'Invoice No',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Invoice Date',
      field: 'sales_invoice_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
      minWidth: 180,
      valueFormatter: (params: any) => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      headerName: 'Sales Order No',
      field: 'sales_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Invoice Status',
      field: 'invoice_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Payment Status',
      field: 'payment_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Grand Total',
      field: 'grand_total',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    }
  ];

  // Column definitions for Advance Payment grid
  public advanceColumnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5
    },
    {
      headerName: 'Transaction Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
      minWidth: 180,
      valueFormatter: (params: any) => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      headerName: 'Amount',
      field: 'advance_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Payment Mode',
      field: 'payment_mode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params) => {
        return params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1).toLowerCase()
          : '-';
      }
    },
    {
      headerName: 'Cheque Number',
      field: 'cheque_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    }
  ];

  // Grid ready handlers for each grid
  onInvoiceGridReady(params: GridReadyEvent) {
    this.invoiceGridApi = params.api;
    // Auto-size columns after data is loaded
    this.invoiceGridApi?.sizeColumnsToFit();
  }

  onAdvanceGridReady(params: GridReadyEvent) {
    this.advanceGridApi = params.api;
    // Auto-size columns after data is loaded
    this.advanceGridApi?.sizeColumnsToFit();
  }

  getCreditLimitHistory(): void {
    this.creditLimitLoading = true;
    this.salesService.getCustomerInvoiceList(this.profileData.id).subscribe({
      next: (res: any) => {
        this.invoiceList = res.data || [];
        this.creditLimitLoading = false;
        // Update grid if API is available
        if (this.invoiceGridApi) {
          this.invoiceGridApi.setRowData(this.invoiceList);
          this.invoiceGridApi.sizeColumnsToFit();
        }
      },
      error: (err) => {
        console.error(err);
        this.invoiceList = [];
        this.creditLimitLoading = false;
      }
    });
  }

  getCustomerAdvanceHistory(): void {
    this.advanceLoading = true;
    this.salesService.getCustomerAdvanceHistory(this.profileData.id).subscribe({
      next: (res: any) => {
        this.advancePaymentData = res.data || [];
        this.advanceLoading = false;

        this.totalCashAmount = this.advancePaymentData
          .filter((item: any) => item.payment_mode?.toLowerCase() === 'cash')
          .reduce((total: number, item: any) => total + Number(item.advance_amount || 0), 0);

        this.chequeTotalAmount = this.advancePaymentData
          .filter((item: any) => item.payment_mode?.toLowerCase() === 'bank')
          .reduce((total: number, item: any) => total + Number(item.advance_amount || 0), 0);
        // Update grid if API is available
        if (this.advanceGridApi) {
          this.advanceGridApi.setRowData(this.advancePaymentData);
          this.advanceGridApi.sizeColumnsToFit();
        }
      },
      error: (err) => {
        console.error(err);
        this.advancePaymentData = [];
        this.advanceLoading = false;
      }
    });
  }
}