import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-customer-so-list',
  templateUrl: './customer-so-list.component.html',
  styleUrls: ['./customer-so-list.component.scss']
})
export class CustomerSoListComponent {

  login_id: any;
  login_id_header: any;
  private gridApi!: GridApi<any>;
  public rowData: any = [];
  
  constructor(private empService: EmpRegistrationService,
    private router: Router, private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.login_id_header = loginData.loginID;
    this.login_id = this.cryptoService.decrypt(this.login_id_header);
    this.getSOListForCustomer();
  }

  public columnDefs: ColDef[] = [
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
      headerName: 'SO No.',
      field: 'sales_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'SO Date',
      field: 'sales_order_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .7,
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
      headerName: 'Item Qty',
      field: 'total_delivered_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5
    },
    {
      headerName: 'Order Amount',
      field: 'order_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .7,
      valueFormatter: (params) => {
        return Number(params.value || 0).toFixed(2);
      }
    },
    {
      headerName: 'Expected Delivery Date',
      field: 'expected_delivery_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
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
      headerName: 'Delivered Date',
      field: 'delivered_on_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
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
      headerName: 'Delivery Address',
      field: 'delivery_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 3
    },
    {
      headerName: 'Order Status',
      field: 'order_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    }
  ];

  getSOListForCustomer() {
    this.empService.getSOListForCustomer(this.login_id).subscribe((res: any) => {
      this.rowData = res.data;
    },
      ((err: any) => {
      this.rowData = [];
      })
    )
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}