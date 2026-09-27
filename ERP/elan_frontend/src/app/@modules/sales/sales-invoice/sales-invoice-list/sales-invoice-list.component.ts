import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../service/sales.service';
import { SalesInvoiceAction } from '../sales-invoice-action/sales-invoice-action.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-invoice-list',
  templateUrl: './sales-invoice-list.component.html',
  styleUrls: ['./sales-invoice-list.component.scss'],
})
export class SalesInvoiceListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;

  constructor(
    public dialog: MatDialog,
    private toast: ToastrService,
    private route: Router,
    private _sales: SalesService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getAllPendingSalesInvoiceData('PENDING')
  }

  getAllPendingSalesInvoiceData(status:any) {
    try {
      this._sales.getAllPendingSalesInvoiceData(status).subscribe(
        (response: any) => {
          if (response.code==200) {
            this.rowData = response.data;
          }
          if (response.code==201) {
            this.rowData = [];
          }
        },
        (err:any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Invoice Number',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customCellRenderer.bind(this),
      tooltipValueGetter: () => 'View Invoice',

    },
    {
  headerName: 'IRN',
  field: 'irn_no',
  colId: 'irnColumn',   
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  hide: true   // 
},

    // {
    //   headerName: 'DO Number',
    //   field: 'do_no',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Company Name',
      field: 'companyName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Grand Total',
    //   field: 'invoice_grand_total',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Date',
      field: 'sales_invoice_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Invoice Created Date',
      field: 'invoiceCreatedAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
       valueFormatter: function(params: any) {
              return moment(params.value).format('YYYY-MM-DD');
            },
    },
    // {
    //   headerName: 'Invoice Mode',
    //   field: 'invoice_mode',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: SalesInvoiceAction,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
    
  ];

  
  customCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.color = 'green';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;
  }

  clickIt(params: any) {
    
    this._sales.getSalesByProsalId(params?.data?.so_id,params?.data?.do_id).subscribe(
      (res: any) => {
        if (res) {
          this.route.navigate(['master/sales/create-sales-invoice'], {
            queryParams: {
              so_id: params?.data?.so_id,
              doId: params?.data?.do_id,
              actionType: 'view-invoice',
            },
          });
        }
      },
      (err: any) => {
        this.toast.warning(err.error.message);
      }
    );
  }


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
columnApi!: ColumnApi;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
     
  this.columnApi = params.columnApi;

  // default tab = PENDING
  this.columnApi.setColumnVisible('irnColumn', false);
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }
selected = new FormControl(0);
  activeTabEvent :any ;
  onTabClick(event: any) {
    let status = 'PENDING';
    this.activeTabEvent = event+1;
    if (event === 0) {
      console.log('=====>',event);
      status='PENDING'
      this.toggleIrnColumn(false);
      this.getAllPendingSalesInvoiceData(status)
    } else if (event === 1) {
      console.log('=====>',event);
      status="APPROVED";
      this.toggleIrnColumn(true);
      this.getAllPendingSalesInvoiceData(status)
      
      
    } else if (event === 2) {
      status="CANCELLED"
      this.getAllPendingSalesInvoiceData(status)
      console.log('=====>',event);
    
    }
  }
  toggleIrnColumn(show: boolean) {
  if (this.columnApi) {
    this.columnApi.setColumnVisible('irnColumn', show);
  }
}

}
