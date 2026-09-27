import { Component } from '@angular/core';
import { SelfAssessmentService } from '../self-assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
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
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: any;
  rowData: any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  entity_id: any;
  id: any;
  countryss_id: any;
  constructor(private language_service: LanguageTranslateService,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog, private route: Router,
    private selfAssessmentService: SelfAssessmentService,
    private _commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.updateColumnDefs();
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
    const date = new Date(year, month - 1, day); 
    const dayFormatted = ('0' + date.getDate()).slice(-2);
    const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
    const yearFormatted = date.getFullYear();
    return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
  }

  department_id: any = []
  EmpMainId: any = [];
  Departmentdata:any[] =[]
  getAllSelfAssessment() {
    let a: any = localStorage.getItem('signInUser');
    a = JSON.parse(a); 
    let b: any = localStorage.getItem('financial_id');
    this.department_id = localStorage.getItem('department_id');
    this.EmpMainId = localStorage.getItem('EmpMainId');
    this.department_id = Number(this.department_id);
    this.EmpMainId = Number(this.EmpMainId);
    this._commonService?.showLoader();
    this.selfAssessmentService.getAllSelfAssessment(this.entity_id, a.employee_id, b).subscribe((res: any) => {
      this.rowData = res.data; 
      this.rowData = this.rowData.map((row: any) => {
        row.start_date2 = this.convert(row.start_date);  
        row.end_date2 = this.convert(row.end_date);      
        return row;
      });
      this.rowData = this.rowData.filter((row: any) => {
        return row.assessment_employee_id == this.EmpMainId && row.assessment_dept_id == this.department_id;
      });
      this._commonService?.hideLoader();
      console.log("Filtered assessmentFinanceYear List:", this.rowData); 
    }, (err: any) => {
      this.rowData = [];  
      this._commonService?.hideLoader(); 
    });
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
          showCustomIcon: false, 
        },
      },
    ];
  }
}