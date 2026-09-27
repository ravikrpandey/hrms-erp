import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionAssessmentComponent } from '../action-assessment/action-assessment.component';
import { SelfAssessmentService } from 'src/app/@modules/employee-self-service/self-assessment/self-assessment.service';
import { AllAssessmentService } from 'src/app/@shared/services/performance-assessment/all-assessment.service';
// import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';

@Component({
  selector: 'app-all-assessment-list',
  templateUrl: './all-assessment-list.component.html',
  styleUrls: ['./all-assessment-list.component.scss']
})
export class AllAssessmentListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: any;
  rowData:any;
  entity_id: any;
  id: any;
  financial_id: string | null;
  loginUser: any;
  EmpMainId: any;
  type: any;
  rowSelection = 'multiple';
  dep:any;
  department_id: any;
  assessment_id: any;
  depData: any = [];
  constructor(private language_service: LanguageTranslateService,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog, private route: Router,
    private allAssessmentService:AllAssessmentService,
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
      this.department_id = params.id;
      this.assessment_id = params.assess_id;
      this.type = params.type
    });
    this.getAllList()
  }

  getAllList = () => {
    this.allAssessmentService.getDepartmentAssessmentList(this.financial_id,this.entity_id,this.assessment_id,this.department_id).subscribe((res:any)=>{
      this.depData = res.data;
      this.rowData = res.data[0]?.user_data;
      this.rowData = this.rowData.map((row:any) => {
        row.assess_id = this.assessment_id;
        row.dept_id = this.department_id;
        return row;
      })
      console.log("+++",this.rowData)
      },(err:any) => {
      this.rowData = []
    })

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
        headerName: 'Employee Name ',
        field: 'employee_name',
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
        headerName: 'Employee Code',
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
        cellRenderer: ActionAssessmentComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
      },
      {
        headerName: '',
        width: 60, // Adjust width to create space for the margin
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellClass: 'checkbox-column', // Add a custom CSS class
      },
    ];
  }  

  getAllPerformanceAssessment(){
    // this.selfAssessmentService.getAllPerformanceAssessment(this.entity_id,this.financial_id,this.EmpMainId).subscribe((res:any)=>{
    //   this.rowData = res.data;
    //   console.log("assessmentFinanceYear List",this.rowData);
    //   },(err:any) => {
    //   this.rowData = []
    // })
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

  onSubmit = () => {

  }
}
