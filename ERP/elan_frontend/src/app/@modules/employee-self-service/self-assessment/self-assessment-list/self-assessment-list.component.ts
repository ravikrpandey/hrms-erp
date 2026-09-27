import { Component } from '@angular/core';
import { SelfAssessmentService } from '../self-assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActionAssessmentComponent } from '../action-assessment/action-assessment.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-self-assessment-list',
  templateUrl: './self-assessment-list.component.html',
  styleUrls: ['./self-assessment-list.component.scss']
})
export class SelfAssessmentListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  columnDefs: any[] = [
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
      headerName: 'Assessment Name',
      field: 'assessment_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      maxWidth: 150,
    },
    {
      headerName: 'Financial Year',
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
      headerName: 'Start Date',
      field: 'start_date2',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'End Date',
      field: 'end_date2',
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
  rowData: any;
  entity_id: any;
  id: any;
  countryss_id: any;

  constructor(
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog,
    private selfAssessmentService: SelfAssessmentService,
    private _commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllSelfAssessment();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  convert(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Months are 0-based in JavaScript
    const dayFormatted = ('0' + date.getDate()).slice(-2);
    const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
    const yearFormatted = date.getFullYear();
    return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
  }


  getAllSelfAssessment() {
    let a: any = localStorage.getItem('signInUser');
    a = JSON.parse(a);
    let b: any = localStorage.getItem('financial_id');
    this._commonService?.showLoader()
    // a  = JSON.parse(a);
    this.selfAssessmentService.getAllSelfAssessment(this.entity_id, a.employee_id, b).subscribe((res: any) => {
      this.rowData = res.data;
      this.rowData = this.rowData.map((row: any) => {
        row.start_date2 = this.convert(row.start_date)
        row.end_date2 = this.convert(row.end_date)
        return row;
      })
      this._commonService?.hideLoader()
      console.log("assessmentFinanceYear List", this.rowData);
    }, (err: any) => {
      this.rowData = []
      this._commonService?.hideLoader()
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
}
