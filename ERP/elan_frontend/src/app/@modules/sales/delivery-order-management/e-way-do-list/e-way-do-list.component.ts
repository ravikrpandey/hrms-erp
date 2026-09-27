import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../service/sales.service';
import { DoAction } from '../do-action/do-action.component';
import { EWayActionComponent } from './e-way-action/e-way-action.component';

@Component({
  selector: 'app-e-way-do-list',
  templateUrl: './e-way-do-list.component.html',
  styleUrls: ['./e-way-do-list.component.scss'],
})
export class EWayList {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
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
    this.entity_id=localStorage.getItem("selectedEntityId")
    this.financial_year_id=localStorage.getItem("financial_id")
    this.getAllEwayData()
  }

  getAllEwayData() {
    try {
      this._sales.getAllEwayData(this.entity_id,this.financial_year_id).subscribe(
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
      minWidth: 100,
    },
    {
      headerName: 'E-way No.',
      field: 'EwbNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: this.customCellRenderer.bind(this),
      tooltipValueGetter: () => 'View Invoice',

    },
    {
      headerName: 'Company',
      field: 'customer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'SO No.',
      field: 'do_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Invoice No.',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'E-way Date',
      field: 'EwbDt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'E-way Valid Till',
      field: 'EwbValidTill',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 100,
      cellRenderer: EWayActionComponent,
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
    
    this.route.navigate(['/master/sales/view-delivery-e-way'], {
      queryParams: {
        doId: params?.data?.do_id,
        eway_id: params?.data?.id,
        invoiceId: params?.data?.irn_invoice_id?params?.data?.irn_invoice_id:params?.data?.invoice_id
      },
    });
    return
    // this._sales.getSalesByProsalId(params?.data?.proposal_id,params?.data?.do_id).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.route.navigate(['master/sales/create-sales-invoice'], {
    //         queryParams: {
    //           proposalId: params?.data?.proposal_id,
    //           doId: params?.data?.do_id,
    //           actionType: 'view-invoice',
    //         },
    //       });
    //     }
    //   },
    //   (err: any) => {
    //     this.toast.warning(err.error.message);
    //   }
    // );
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
