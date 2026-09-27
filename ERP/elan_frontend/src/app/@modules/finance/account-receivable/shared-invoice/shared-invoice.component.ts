import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-shared-invoice',
  templateUrl: './shared-invoice.component.html',
  styleUrls: ['./shared-invoice.component.scss']
})

export class SharedInvoiceComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  loginUser: any;

  constructor(private _empService: EmpRegistrationService, public dialog: MatDialog) {
    this.rowClass = 'rowClass'
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    localStorage.setItem("employee_id:", "undefined");
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.rowData = res.data;

    })

  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      field: 'employee_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'BR No',
      field: 'employee_code', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Work Order',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Associate Company',
      field: 'employee_official_email', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'requested By',
      field: 'mobile_number', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 150,
      // cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  onBtPrint() {
    window.print()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellClicked(e: any) {


    // const dialogRef = this.dialog.open(EmpListDialogComponent, { width: '600px', data: { id: e.data.employee_id } });
    // dialogRef.afterClosed().subscribe(result => {
    //   
    // })
  }
}
