import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { BehaviorSubject } from 'rxjs';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { QuotationActionComponent } from '../quotation-action/quotation-action.component';
import { ToastrService } from 'ngx-toastr';
import { QuotationStatusComponent } from '../quotation-status/quotation-status.component';

@Component({
  selector: 'app-pending-quotations',
  templateUrl: './pending-quotations.component.html',
  styleUrls: ['./pending-quotations.component.scss']
})
export class PendingQuotationsComponent {
  rowClass: any;
  columnDefs: any;
  rowData: any=[];
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple',enableCellTextSelection: true,
    enableRangeSelection: true, };
  count: any = 0;
  assignAction: any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  pendingQuotations: any=[];
  mainEmpId: any;
  mainDepId: string | null;
  gridColumnApi: any;
  entityId: string | null;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private salesManagementService: SalesManagementService,
    private toast: ToastrService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.mainDepId = localStorage.getItem('department_id')
    this.entityId = localStorage.getItem('selectedEntityId');

    this.getPendingRecordByDepID(this.mainEmpId)
    this.updateColumnDefs();
    // this.getAllQuotationsData();
  }
  getPendingRecordByDepID(id: any) {
    this.salesManagementService.getQuotationByMainId(id,"PENDING",this.entityId).subscribe((res: any) => {
      this.rowData = res.data;
      });
    }
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
    // updateQuotationByDepId(id: any,quot_id:any, status: string) {
    //   this.salesManagementService.updateQuotationByDepId(id,quot_id, status).subscribe((res: any) => {
    //     this.toast.success('Status updated sucessfully');
    //     this.reloadCurrentRoute()
    //   });
    // }


  navigateAddNew() {
    this.route.navigate(['master/sales-management/create-quotation']);
  }
  navigatePending() {
    this.route.navigate(['master/sales-management/pending-quotations']);
  }
  navigateApproved() {
    this.route.navigate(['master/sales-management/approved-quotations']);
  }
  navigateRejected() {
    this.route.navigate(['master/sales-management/rejected-quotations']);
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/quotation']);
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  private getColumnHeaderTranslations() {
    return {
      en: {
        sno: 'S.NO',
        holiday_name: 'Holiday Name',
        region_name : ' Resign Name  ',
        name_of_municipality: 'Municipality Name',
        action: 'Action',
        status : 'Status'
      },
      pt: {
        sno: 'Nº',
        holiday_name: 'Código CC',
        region_name: 'Nome do Departamento',
        name_of_municipality: 'Estado',
        status:'Status',
        action: 'Ação',

      }
    };
  }

  private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];

    this.columnDefs = [
      {
        headerName: translations.sno,
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        maxWidth: 85,
      },
      {
        field: 'quotation_doc_code',
        headerName: 'Quotation Number',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'business_name',
        headerName: 'Customer',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'create_date',
        headerName: 'Created Date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: { value: string | number | Date; }) => {
          // Format the date using Angular's DatePipe
          return new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },

      {
        field: 'grand_total',
        headerName: 'Amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'employee_name',
        headerName: 'Sales Rep',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Category',
        field: 'asset_category_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
     {
      field: 'status',
      headerName: 'Status',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['PENDING','APPROVED', 'REJECTED'],
      },

    },



      {
        headerName: translations.action,
        field: 'quotation_doc_code',
        flex: 1,
        minWidth: 120,
        cellRenderer: QuotationActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          //////
          hideEditIcon: true, 
          hideDeleteIcon: true,
        },
        cellClass: 'grid-cell-centered',
      },
    ];
  }
  // onCellValueChanged(event: CellValueChangedEvent) {
  //   if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
  //     const newValue = event.newValue;
  //     if (newValue === 'APPROVED' || newValue === 'REJECTED') {
  //     this.updateQuotationByDepId(this.mainDepId,event.data.quotation_doc_code, event.newValue);
  //     }
  //   }
  // }
  statusCellClicked(event: any) {

    const clickedRowData = event.data;
    const clickedColumn = event.column.getColId();
    const clickedValue = event.value;


        if (clickedRowData) {

          const dialogRef = this.dialog.open(QuotationStatusComponent,
            { width: '450px',
              data: { cellData: clickedRowData,status:"Update",
            } });

            dialogRef.afterClosed().subscribe((result) => {

              if (result) {
                console.log('Dialog closed with result:', result);
              } else {
                console.log('Dialog was closed without result');
              }
            });
          }


      }
  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  addRecordToGrid(data: any) {
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  // getAllQuotationsData() {
  //   this.salesManagementService.getAllQuotations().subscribe((data: any) => {
  //     this.pendingQuotations = data.data.filter((quotation: any) => quotation.status === "PENDING");
  //     this.rowData = this.pendingQuotations;
  //   });
  // }
}
