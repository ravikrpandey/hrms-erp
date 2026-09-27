import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../service/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
@Component({
  selector: 'app-customer-aging-list',
  templateUrl: './customer-aging-list.component.html',
  styleUrls: ['./customer-aging-list.component.scss']
})
export class CustomerAgingListComponent {

    
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  entityId:any
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  customerId: any;

  constructor(
    public dialog: MatDialog,
    private _sales: SalesService,private route: ActivatedRoute
  ) {
    this.rowClass = 'rowClass';
  }

 async ngOnInit() {
  this.entityId = localStorage.getItem('selectedEntityId');
  this.customerId = this.route.snapshot.paramMap.get('id');
  this.getCustomerEgingByCustomerId()
  }
  async getCustomerEgingByCustomerId() {
    try {
      this._sales.getCustomerAgingByCustomerId(this.customerId).subscribe(
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
      minWidth:100
    },
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered link-cell',
      flex: 1,
      minWidth: 200
    }, 
    {
      headerName: 'Invoice No.',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered link-cell',
      flex: 1,
      minWidth: 200
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
      minWidth:150
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
