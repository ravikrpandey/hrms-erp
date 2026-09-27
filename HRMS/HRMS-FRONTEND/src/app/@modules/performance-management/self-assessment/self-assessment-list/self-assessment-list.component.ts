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
  feedBack: any = "feedback";
  financial_id: string | null;
  loginUser: any;
  EmpMainId: any;
  type: any;
  countData: any;
  reportingManagerId: any
  approvalManagerId: any

  constructor(private language_service: LanguageTranslateService,
    private activetRoute: ActivatedRoute,
    private _commonService: CommonService,
    public dialog: MatDialog, private route: Router,
    private selfAssessmentService: SelfAssessmentService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
      this.type = params.type
    });
    this.getCount()
    if (!this.type) {
      this.onFeedBackChange('Assessment');
    }
    else {
      this.onFeedBackChange(this.type)
    }
  }


  async loadData(): Promise<void> {
    if (this.feedBack === 'feedback') {
    } else {
      await this.loadPerformanceAndApprovalData();
    }
  }

  Combinedata:any =[]
  async loadPerformanceAndApprovalData(): Promise<void> {
    try {
      this._commonService.showLoader();
      const performanceData = await this.getPerformanceAssessmentData();
      const approvalManagerData = await this.getApprovalManagerData();
      this.rowData  =[...performanceData, ...approvalManagerData];
      // this.rowData = this.Combinedata.reduce((acc: any[], current: any) => {
      //   const x = acc.find(item => item.user_id === current.user_id);
      //   if (!x) {
      //     acc.push(current);
      //   }
      //   return acc;
      // }, []);
      
  
      this._commonService.hideLoader();
    } catch (error) {
      // console.error('Error loading performance and approval data', error);
      this._commonService.hideLoader();
    }
  }



  async getPerformanceAssessmentData(): Promise<any[]> {
    try {
      const res: any = await this.selfAssessmentService.getAllPerformanceAssessment(
        this.entity_id,
        this.financial_id,
        this.EmpMainId
      ).toPromise();
      console.log('Performance Assessment Data:', res.data);
      const reportingManagerId = "ReportingManager"; 
      if (reportingManagerId) {
        this.sendReportingManagerIdToComponent(reportingManagerId);
      } else {
        // console.warn('No Reporting Manager ID available');
      }
      return res.data || []; 
    } catch (error) {
      // console.error('Error fetching performance assessment data', error);
      return [];
    }
  }
  
  async getApprovalManagerData(): Promise<any[]> {
    try {
      const res: any = await this.selfAssessmentService.getAllApprovalManager(
        this.entity_id,
        this.financial_id,
        this.EmpMainId
      ).toPromise();
      // console.log('Approval Manager Data:', res.data);
      const approvalManagerId = "ApprovalManager"; 
      if (approvalManagerId) {
        this.sendApprovalManagerIdToComponent(approvalManagerId);
      } else {
        console.warn('No Approval Manager ID available');
      }
      return res.data || []; 
    } catch (error) {
      console.error('Error fetching approval manager data', error);
      return [];
    }
  }
  
  sendReportingManagerIdToComponent(reportingManagerId: string): void {
    this.reportingManagerId = reportingManagerId;
    // console.log('Reporting Manager ID assigned:', this.reportingManagerId);
    this.selfAssessmentService.changeReportingManagerId(this.reportingManagerId);
  }
  
  sendApprovalManagerIdToComponent(approvalManagerId: string): void {
    this.approvalManagerId = approvalManagerId;
    // console.log('Approval Manager ID assigned:', this.approvalManagerId);
    this.selfAssessmentService.changeApprovalManagerId(this.approvalManagerId); 
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
            showCustomIcon: false,
          },
        },
      ];

      this.rowData = [
        // {
        //   "financial_year": "2023-2024",
        //   "month": "January",
        //   "employee_name": "John Doe",
        //   "end_date": "E12345",  // Consider renaming 'end_date' to 'employee_number' if more appropriate
        //   "status": "Active",
        //   "id": 1
        // },
        // {
        //   "financial_year": "2023-2024",
        //   "month": "March",
        //   "employee_name": "Emily Johnson",
        //   "end_date": "E12347",  // Same note as above
        //   "status": "Active",
        //   "id": 2
        // }
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
            showCustomIcon: false, 
            reportingManagerId: this.reportingManagerId,
          },
        },
      ];
      this.loadData();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ActionAssessmentComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }



  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged(): void {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged(): void {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  getCount() {
    this.selfAssessmentService.getAllCount(this.entity_id, this.EmpMainId).subscribe((res: any) => {
      this.countData = res.total_team_members;
      console.log("count", this.countData);
    }, (err: any) => {
      this.rowData = []
    })
  }


}














