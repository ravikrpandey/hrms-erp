import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';
import { SalesReturnActionComponent } from './sales-return-action/sales-return-action.component';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})
export class SalesReturnComponent {
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
  role_master_id: any;
  selected = new FormControl(0);

    constructor( private toaster: ToastrService,  private salesService: SalesService) 
  {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    const entity_id = localStorage.getItem('selectedEntityId')
    const financial_id = localStorage.getItem('financial_id')
    this.getsSalesReturn(financial_id,entity_id);
  }

  getsSalesReturn(financial_id:any,entity_id:any){
    this.salesService.getsSalesReturn(financial_id,entity_id).subscribe({
      next:(res:any)=> {
        console.log(res.data);
        this.rowData = res.data.map((item: any) => {

            const totalQty = item.SALES_RETURN_ITEMS?.reduce(
              (sum: number, row: any) => sum + Number(row.qty || 0),
              0
            );

            const totalReturnQty = item.SALES_RETURN_ITEMS?.reduce(
              (sum: number, row: any) => sum + Number(row.return_qty || 0),
              0
            );

            return {
              ...item,
              total_qty: totalQty,
              return_qty: totalReturnQty,
              customer: item.CUSTOMER?.company_name || '',
              sales_order_no: item.SALES_ORDER?.so_no || ''
            };
        });
      },error: (err: any) => {
        console.log(err);
        this.rowData = [];
      }
    })
  }
 
  public columnDefs: ColDef[] = [
  {
    headerName: 'S.No.',
    valueGetter: 'node.rowIndex + 1',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 0.5,
    minWidth: 80,
    // pinned: 'sleft',
  },
  {
    headerName: 'Return No',
    field: 'return_no',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    tooltipField: 'return_no',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 160,
  },
  {
    headerName: 'Return Type',
    field: 'reference_type',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    tooltipField: 'reference_type',
    cellClass: 'grid-cell-centered',
    flex: 1.2,
    minWidth: 180,
  },
  {
    headerName: 'Customer',
    field: 'customer',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    tooltipField: 'customer',
    cellClass: 'grid-cell-centered',
    flex: 1.5,
    minWidth: 220,
  },
  {
    headerName: 'Warehouse',
    field: 'warehouse',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    tooltipField: 'warehouse',
    cellClass: 'grid-cell-centered',
    flex: 1.2,
    minWidth: 180,
  },
  {
    headerName: 'Total Qty',
    field: 'total_qty',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 0.8,
    minWidth: 120,
  },
  {
    headerName: 'Return Qty',
    field: 'return_qty',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 0.8,
    minWidth: 120,
  },
  {
    headerName: 'Created Date',
    field: 'createdAt',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1.2,
    minWidth: 180,
    valueFormatter: (params: any) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('en-IN');
    },
  },
  {
    headerName: 'Action',
    field: 'id',
    cellRenderer: SalesReturnActionComponent,
    sortable: false,
    resizable: false,
    cellClass: 'grid-cell-centered',
    flex: 1.2,
    minWidth: 100,
    pinned: 'right',
  }
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