import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../service/sales.service';
import { DoAction } from '../do-action/do-action.component';

@Component({
  selector: 'app-all-do-list',
  templateUrl: './all-do-list.component.html',
  styleUrls: ['./all-do-list.component.scss'],
})
export class AllDoList {
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
  entity_id: any;
  financial_year_id: any;

  constructor(
    public dialog: MatDialog,
    private toast: ToastrService,
    private route: Router,
    private _sales: SalesService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');

    this.getAllDeliveryChallan();
    // this.getAllSalesOrder();
  }

  getAllDeliveryChallan() {
    try {
      this._sales
        .getAllDeliveryChallan(this.entity_id, this.financial_year_id)
        .subscribe(
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
  getAllSalesOrder() {
    try {
      this._sales
        .getAllSalesOrder(this.entity_id, this.financial_year_id)
        .subscribe(
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
      headerName: 'So No.',
      field: 'do_no', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueGetter: (params:any) => params.data?.do_no || 'N/A',
      cellRenderer: this.customCellRenderer.bind(this),
  },

    {
      headerName: 'Customer',
      field: 'customer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Type',
      field: 'do_type_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Billing Branch',
      field: 'billing_branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'do_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Invoice Mode',
      field: 'challan_type_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: DoAction,
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
  // view-order
  clickIt(params:any){
    
    this._sales.getSalesByProsalId(params?.data?.so_id,params?.data?.id).subscribe((res:any)=>{
      if(res){
        this.route.navigate(["master/sales/view-delivery-challan"], { queryParams: {sales_id: params?.data?.so_id ,doId: params?.data?.id} })
        } 
      },(err:any)=>{
       this.toast.warning(err.error.message)
    
    })
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }
}
