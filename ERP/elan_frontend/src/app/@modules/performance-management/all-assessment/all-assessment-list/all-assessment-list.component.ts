import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActionAssessmentComponent } from '../action-assessment/action-assessment.component';
import { AllAssessmentService } from 'src/app/@shared/services/performance-assessment/all-assessment.service';
import { CommonService } from 'src/app/@shared/services/common.service';

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
  rowData: any;
  entity_id: any;
  id: any;
  financial_id: string | null;
  loginUser: any;
  EmpMainId: any;
  type: any;
  rowSelection = 'multiple';
  dep: any;
  department_id: any;
  assessment_id: any;
  depData: any = [];
  params: any;
  assess_name: any;
  constructor(
    private activetRoute: ActivatedRoute,
    private _commonService: CommonService,
    public dialog: MatDialog, private route: Router,
    private allAssessmentService: AllAssessmentService,
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
      this.params = params;
      this.department_id = params.id;
      this.assessment_id = params.assess_id;
      this.type = params.type
      this.assess_name = params.assess_name;
    });
    this.getAllList()
  }

  back() {
    this.route.navigate([`//master/performance/all-assessment/department`], { queryParams: { id: this.params.assess_id, assess_name: this.assess_name } })
  }

  getAllList = () => {
    this._commonService?.showLoader()
    this.allAssessmentService.getDepartmentAssessmentList(this.financial_id, this.entity_id, this.assessment_id, this.department_id).subscribe((res: any) => {
      this.depData = res.data;
      this._commonService?.hideLoader()
      this.rowData = res.data[0]?.user_data;
      this.rowData = this.rowData.map((row: any) => {
        row.assess_id = this.assessment_id;
        row.dept_id = this.department_id;
        row.assess_name = this.assess_name;
        return row;
      })
      console.log("+++", this.rowData)
    }, (err: any) => {
      this._commonService?.hideLoader()
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
        maxWidth: 85,
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
        minWidth: 150,
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
      {
        headerName: '',
        width: 60, // Adjust width to create space for the margin
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellClass: 'checkbox-column', // Add a custom CSS class
      },
    ];
  }

  getAllPerformanceAssessment() {
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
