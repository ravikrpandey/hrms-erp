import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';

import { SalesManagementService } from '../sales-management-service/sales-management.service';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { BehaviorSubject } from 'rxjs';
import { QuotationActionComponent } from './quotation-action/quotation-action.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { QuotationStatusPopComponent } from './quotation-status-pop/quotation-status-pop.component';
import { QuotationStatusComponent } from './quotation-status/quotation-status.component';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss'],
})
export class QuotationsComponent {
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
  entityId: string | null;
  customersList: any=[];
  getUserRole: any;
  employeeList: any=[];
  mainEmpId: string | null;

  constructor(
    private route: Router,
    public mtdialog: MatDialog,
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    public dialog: MatDialog,

  ) {
    this.rowClass = 'rowClass';
    this.entityId = localStorage.getItem('selectedEntityId');
    const signInUserData = localStorage.getItem('signInUser');
    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }

    this.getCoustomersList()
    this.getemployeeList()


  }

  async ngOnInit(): Promise<void> {
    this.mainEmpId = localStorage.getItem('EmpMainId')

     this.getQuotationRecordByID(this.mainEmpId)

    // await this.getAllQuotationsData();

    this.updateColumnDefs();
  }

  getQuotationRecordByID(id: any) {
    this.salesManagementService.getQuotationByMainId(id,"ALL",this.entityId).subscribe((res: any) => {
      this.rowData = res.data.reverse();
      return
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
        field: 'temp_customer_name',
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
        field: 'temp_sales_rep_name',
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
  onCellClicked(e:any){
    const dialogRef = this.dialog.open(QuotationStatusComponent, {
      data: { id:e.data.id ,status:"View"},

      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {

    });

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


  // getCoustomersList() {
  //   this.salesManagementService
  //     .getAllSuperUser(this.entityId)
  //     .subscribe((data: any) => {
  //       this.customersList = data.data;
  //     });
  // }
  // getAllQuotationsData() {
  //   this.salesManagementService.getAllQuotations().subscribe((data: any) => {
  //     this.rowData = data.data;
  //   });
  // }

  getCoustomersList() {
    this.salesManagementService
      .getAllActiveSuperUser(this.entityId)
      .subscribe((data: any) => {
        this.customersList = data.data;
      });
  }

  getemployeeList() {
    this._empService
      .grtEmployeeList(this.entityId, this.getUserRole)
      .subscribe((res: any) => {
        this.employeeList = res.data

      });
  }
  // getAllQuotationsData() {
  //   this.salesManagementService.getAllQuotations().subscribe((data: any) => {
  //     this.rowData = data.data.reverse();

  //     this.rowData.forEach((quotation: any) => {
  //       const matchingCustomer = this.customersList.find((customer: any) => customer.id === quotation.customer_id);
  //       const matchingEmployee = this.employeeList.find((employee: any) => employee.employee_id === quotation.sales_rep_id);

  //       if (matchingCustomer) {
  //         quotation.temp_customer_name = matchingCustomer.business_name;
  //       }
  //       if (matchingEmployee) {
  //         quotation.temp_sales_rep_name = matchingEmployee.first_name+" "+matchingEmployee.last_name;
  //       }

  //     });
  //   });
  // }


}
