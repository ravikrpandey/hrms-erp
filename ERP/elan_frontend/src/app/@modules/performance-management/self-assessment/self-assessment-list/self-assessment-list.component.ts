import { Component } from '@angular/core';
import { SelfAssessmentService } from '../self-assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActionAssessmentComponent } from '../action-assessment/action-assessment.component';
import { CommonService } from 'src/app/@shared/services/common.service';
// import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';

@Component({
  selector: 'app-self-assessment-list',
  templateUrl: './self-assessment-list.component.html',
  styleUrls: ['./self-assessment-list.component.scss']
})
export class SelfAssessmentListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: any;
  rowData: any;
  entity_id: any;
  id: any;
  countryss_id: any;
  feedBack: any = "feedback";
  financial_id: string | null;
  loginUser: any;
  EmpMainId: any;
  type: any;
  countData: any;
  constructor(
    private activetRoute: ActivatedRoute,
    private _commonService: CommonService,
    public dialog: MatDialog, private route: Router,
    private selfAssessmentService: SelfAssessmentService,
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    // this.updateColumnDefs();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
      this.type = params.type
    });
    this.getCount()
    if (!this.type) {
      this.onFeedBackChange('feedback');
    }
    else {
      this.onFeedBackChange(this.type)
    }
  }

  onFeedBackChange(value: string): void {
    this.feedBack = value;
    console.log('Selected Feedback:', this.feedBack);
    if (this.feedBack == 'feedback') {
      this.columnDefs = [
        {
          headerName: 'S.No',
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
          headerName: 'Financial Year ',
          field: 'financial_year',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
          //editable: true,
        },
        {
          headerName: 'Month',
          field: 'month',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Employee Name',
          field: 'employee_name',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Employee Number ',
          field: 'end_date',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Status',
          field: 'status',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Action',
          field: 'id',
          flex: 1,
          minWidth: 150,
          cellRenderer: ActionAssessmentComponent,
          cellRendererParams: {
            className: 'mat-blue',
            hideRequestButton: true,
            hideDetailsButton: false,
            hideDownloadIcon: false,
            showCustomIcon: false, // Hide attachment icon
          },
        },
      ];

      this.rowData = [
        {
          "financial_year": "2023-2024",
          "month": "January",
          "employee_name": "John Doe",
          "end_date": "E12345",  // Consider renaming 'end_date' to 'employee_number' if more appropriate
          "status": "Active",
          "id": 1
        },
        {
          "financial_year": "2023-2024",
          "month": "March",
          "employee_name": "Emily Johnson",
          "end_date": "E12347",  // Same note as above
          "status": "Active",
          "id": 2
        }
      ];
    }
    else {
      console.log("++++DSdsSD+++++")
      this.columnDefs = [
        {
          headerName: 'S.No',
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
          headerName: 'Financial Year ',
          field: 'financial_year',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
          //editable: true,
        },
        {
          headerName: 'Employee Name',
          field: 'first_name',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Employee Code ',
          field: 'employee_code',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Status',
          field: 'status',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: 'Action',
          field: 'id',
          flex: 1,
          minWidth: 150,
          cellRenderer: ActionAssessmentComponent,
          cellRendererParams: {
            className: 'mat-blue',
            hideRequestButton: true,
            hideDetailsButton: false,
            hideDownloadIcon: false,
            showCustomIcon: false, // Hide attachment icon
          },
        },
      ];
      console.log("++++++++++++++++function reached here+++++++++++++++")
      this.getAllPerformanceAssessment();
    }
  }

  getAllPerformanceAssessment() {
    this._commonService?.showLoader()
    this.selfAssessmentService.getAllPerformanceAssessment(this.entity_id, this.financial_id, this.EmpMainId).subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
      console.log("assessmentFinanceYear List", this.rowData);
    }, (err: any) => {
      this._commonService?.hideLoader()
      this.rowData = []
    })
  }

  getCount() {
    this.selfAssessmentService.getAllCount(this.entity_id, this.EmpMainId).subscribe((res: any) => {
      this.countData = res.total_team_members;
      console.log("count", this.countData);
    }, (err: any) => {
      this.rowData = []
    })
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  openDialog() {
    const dialogRef = this.dialog.open(ActionAssessmentComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  private updateColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'S.No',
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
        headerName: 'Financial Year ',
        field: 'financial_year',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        //editable: true,
      },
      {
        headerName: 'Employee Name',
        field: 'employee_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Employee Number ',
        field: 'end_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: ActionAssessmentComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
      },
    ];
  }
}
