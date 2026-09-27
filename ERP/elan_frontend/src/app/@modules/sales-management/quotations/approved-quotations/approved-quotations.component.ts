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
import { QuotationActionComponent } from '../quotation-action/quotation-action.component';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';

@Component({
  selector: 'app-approved-quotations',
  templateUrl: './approved-quotations.component.html',
  styleUrls: ['./approved-quotations.component.scss']
})
export class ApprovedQuotationsComponent {
  rowClass: any;
  columnDefs: any;
  rowData: any=[];
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  count: any = 0;
  assignAction: any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  approvedQuotations: any=[];
  customersList: any;
  employeeList: any;
  mainEmpId: string | null;
  entityId:any;
  userRole:any;

  constructor(
    private route: Router,
    public mtdialog: MatDialog,
    private salesManagementService: SalesManagementService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId')
    let token:any  = localStorage.getItem('signInUser');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.userRole = JSON.parse(token);

    this.getApprovedRecordByID(this.mainEmpId)
    this.updateColumnDefs();

    }

  getApprovedRecordByID(id: any) {
    this.salesManagementService.getQuotationByMainId(id,'APPROVED',this.entityId,this.userRole.role).subscribe((res: any) => {
      this.rowData = res.data;
      this.rowData = this.rowData.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.quotation_doc_code === value.quotation_doc_code)
      );
      });
    }

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
        field: 'approval_status',
        headerName: 'Status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
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
        },
        cellClass: 'grid-cell-centered',
      },
    ];
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    // Handle cell value changes if needed
    if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
      // this.updateLeaveStatus(event.data);
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
  //     this.approvedQuotations = data.data.filter((quotation: any) => quotation.status === "APPROVED");
  //     this.rowData = this.approvedQuotations;
  //   });
  // }

}
