import { Component } from '@angular/core';
import { SelfAssessmentService } from 'src/app/@modules/employee-self-service/self-assessment/self-assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '../committee-review-action/action.component';
import { CommitteeReviewService } from 'src/app/@shared/services/performance-assessment/committee-review.service';
// import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';

@Component({
  selector: 'app-committee-review-list',
  templateUrl: './committee-review-list.component.html',
  styleUrls: ['./committee-review-list.component.scss']
})
export class CommitteeReviewListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: any;
  rowData:any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  entity_id: any;
  id: any;
  countryss_id: any;
  feedBack:any = "feedback";
  financial_id: string | null;
  loginUser: any;
  EmpMainId: any;
  type: any;
  active: any = true;
  status: any;
  dept_id:any;
  assess_id:any;
  constructor(private language_service: LanguageTranslateService,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog, private route: Router,
    private committeeReviewService: CommitteeReviewService,
  ){
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
      this.type = params.type
      this.dept_id = params.id;
      this.assess_id = params.assess_id;
    });
    if (!this.type) {
      this.fetchData(true);
    }
    else {
      this.fetchData(this.type)
    }
  }

  fetchData(value:any): void {
    if(value){
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
          maxWidth:85,
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
          minWidth:150,
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
          minWidth:150,
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
          minWidth:150,
        },
        {
          headerName: 'Status',
          field: 'submitted_assessment_status',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth:150,
        },
        {
          headerName: 'Action',
          field: 'id',
          flex: 1,
          minWidth: 150,
          cellRenderer: ActionComponent,
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
    else{
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
          maxWidth:85,
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
          minWidth:150,
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
          minWidth:150,
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
          minWidth:150,
        },
        {
          headerName: 'Status',
          field: 'submitted_assessment_status',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth:150,
        },
        {
          headerName: 'Action',
          field: 'id',
          flex: 1,
          minWidth: 150,
          cellRenderer: ActionComponent,
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
    if (value) {
      this.status = 'Pending Committee Review'
    }else {
      this.status = 'Committee Review Completed'
    } 
    this.getAllAssessment();
  }

  fetchList = (value:any) => {
    this.active = value;
    this.fetchData(value);
  }
  
  getAllAssessment(){
    this.committeeReviewService.getAllCommitteeReviewList(this.EmpMainId,this.financial_id,this.entity_id,this.status).subscribe((res:any)=>{
      this.rowData = res.data;
     
      },(err:any) => {
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
        maxWidth:85,
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
        minWidth:150,
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
        minWidth:150,
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
        minWidth:150,
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
        minWidth:150,
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: ActionComponent,
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
