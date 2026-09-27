import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { SalesService } from '../../service/sales.service';
import { CustomerSbActionComponent } from '../customer-sb-action/customer-sb-action.component';

@Component({
  selector: 'app-customer-sb-list',
  templateUrl: './customer-sb-list.component.html',
  styleUrls: ['./customer-sb-list.component.scss']
})
export class CustomerSbListComponent {
  login_id: any;
  login_id_header: any;
  private gridApi!: GridApi<any>;
  public rowData: any = [];
  public page = 1;
  public limit = 10;
  public totalRecords = 0;
  public totalPages = 0;
  constructor(private empService: EmpRegistrationService, private _salesService: SalesService,
    private router: Router, private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.login_id_header = loginData.loginID;
    this.login_id = this.cryptoService.decrypt(this.login_id_header);
    this.page = 1;
    this.limit = 10;
    this.getSBListForCustomer();
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: (params: any) => {
        return (this.page - 1) * this.limit + (params.node.rowIndex + 1);
      },
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5
    },
    {
      headerName: 'Document No.',
      field: 'documentNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,

      valueGetter: (params: any) => {

        const data = params.data;

        if (!data) {
          return '-';
        }

        switch (data.trackingType) {

          case 'quotation':
            return data.proposalNo || '-';

          case 'pi':
            return data.piNumber || '-';

          case 'sales_booking':
            return data.salesBookingNo || '-';

          default:
            return '-';
        }
      }
    },
    {
      headerName: 'Company Name',
      field: 'companyName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'Version',
      field: 'version',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
      minWidth: 180,

    },
    {
      headerName: 'Amount',
      field: 'grantTotal',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
      minWidth: 180,

    },

    {
      headerName: 'Created Date',
      field: 'createdAt',
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
      headerName: 'Status',
      field: 'actionStatus',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params: any) => {
    return params.value
      ? String(params.value).toUpperCase()
      : '-';
  }
    },
     {
          headerName: 'Action',
          field: 'id',
          pinned: 'right',
          flex: 1,
          minWidth: 100,
          cellRenderer: CustomerSbActionComponent,
          cellRendererParams: {
            className: 'mat-blue',
            hideRequestButton: true,
            hideDetailsButton: false,
            hideDownloadIcon: false,
            showCustomIcon: false,
          },
        },
  ];

  getSBListForCustomer() {
    this._salesService.customerWiseSB(this.page, this.limit,this.login_id).subscribe((res: any) => {
      this.rowData = res.data;
      this.totalRecords = res?.pagination?.total || 0;

      this.totalPages = res?.pagination?.totalPages || 0;
    },
      ((err: any) => {
        this.rowData = [];
        this.rowData = [];
        this.totalRecords = 0;
        this.totalPages = 0;
      })
    )
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onPageChange(page: number): void {

    if (
      page < 1 ||
      (this.totalPages > 0 && page > this.totalPages)
    ) {
      return;
    }

    this.page = page;

    this.getSBListForCustomer();
  }
  onPageSizeChange(event: any): void {

    this.limit = Number(event.target.value);

    this.page = 1;

    this.getSBListForCustomer();
  }
   
  get pages(): number[] {
    const totalPages = this.totalPages;
    const current = this.page;
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  createNew(){
    
    this.router.navigate(["master/sales/create-proposal"], { queryParams: { client_id:this.login_id,type:'existing_client',actionType:'create',quotationType:true} })

  }
}
