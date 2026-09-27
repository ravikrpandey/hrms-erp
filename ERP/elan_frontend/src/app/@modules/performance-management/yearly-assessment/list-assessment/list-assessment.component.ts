import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';
import { ActionAssessmentComponent } from '../action-assessment/action-assessment.component';
import { YearlyAssessmentService } from '../../../../@shared/services/performance-management/yearly-assessment.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-list-assessment',
  templateUrl: './list-assessment.component.html',
  styleUrls: ['./list-assessment.component.scss']
})
export class ListAssessmentComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: ColDef[] = [
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
      headerName: 'Assessment Name',
      field: 'assessment_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
  financial_id: any;
  constructor(
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog,
    private assessmentService: YearlyAssessmentService,
    private _commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.getAllAssessment();
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

  getAllAssessment() {
    this._commonService?.showLoader()
    this.assessmentService.getAllAssessment(this.entity_id, this.financial_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.rowData = res.data;

      this.rowData = this.rowData.map((row: any) => {
        row.start_date2 = this.convert(row.start_date)
        row.end_date2 = this.convert(row.end_date)
        return row;
      })
      console.log("assessmentFinanceYear List", this.rowData);
    }, (err: any) => {
      this._commonService?.hideLoader()
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
    const dialogRef = this.dialog.open(CreateAssessmentComponent, {
      // data: { id: this.queryParamss },
      width: '368px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
}
