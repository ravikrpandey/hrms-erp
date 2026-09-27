import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesInvoiceAction } from '../sales-invoice/sales-invoice-action/sales-invoice-action.component';
import { SalesService } from '../service/sales.service';

@Component({
  selector: 'app-customer-aging-report',
  templateUrl: './customer-aging-report.component.html',
  styleUrls: ['./customer-aging-report.component.scss']
})
export class CustomerAgingReportComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  entityId:any
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };

  constructor(
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private _sales: SalesService,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

 async ngOnInit() {
  this.entityId = localStorage.getItem('selectedEntityId');
  this.getCustomerEging()
  }
  async getCustomerEging() {
    try {
      this._sales.getCustomerAging(this.entityId).subscribe(
        (response: any) => {
          if (response.code == 200) {
            this.rowData = response.data;
          }
          if (response.code == 201) {
            this.rowData = [];
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  goToCustomerInvoices(data: any) {
    console.log(data.customer_id);
    this.route.navigate([
      '/master/sales/report/customer-aging',
      data.customer_id
    ]);
  }
  public columnDefs: any = [
      {
        headerName: 'S No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered ',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Customer Name',
        field: 'customer_name',
        cellStyle: {
          color: 'blue',
          'text-decoration': 'underline',
          cursor: 'pointer'
        },
        onCellClicked: (params: any) => {
          this.goToCustomerInvoices(params.data);
        }
      },
      {
        headerName: 'Customer Code',
        field: 'customer_code',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Credit Limit',
        field: 'sactioned_credit_limit',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
     
      {
        headerName: 'Credt Days',
        field: 'utilized_credit_days',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Current Balance',
        field: 'total_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '0-30',
        field: 'amt_0_30',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '31-60',
        field: 'amt_31_60',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '61-90',
        field: 'amt_61_90',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '91-120',
        field: 'amt_91_120',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '121-150',
        field: 'amt_121_150',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '151-180',
        field: 'amt_151_180',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '181-210',
        field: 'amt_181_210',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '211-240',
        field: 'amt_211_240',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '241-270',
        field: 'amt_241_270',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '271-300',
        field: 'amt_271_300',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '301-330',
        field: 'amt_301_330',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: '330+',
        field: 'amt_330_plus',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
  
    ];





  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }






}
