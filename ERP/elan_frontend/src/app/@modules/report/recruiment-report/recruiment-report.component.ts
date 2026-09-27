import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-recruiment-report',
  templateUrl: './recruiment-report.component.html',
  styleUrls: ['./recruiment-report.component.scss']
})
export class RecruimentReportComponent {


  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  jobIdNew: any;
  assignAction: any;
  entity_id: string | null;
  user_id: any;
  userDetails: any = {};
  departments: any;
  navWidth: number = 0;
  startDate: Date;
  endDate: Date;
  status: string[] = ["PENDING", "APPROVED", "REJECTED","HOLD","GO_FOR_BGV"];


  // dateFormatter: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  entityId:any
  constructor(
    private recruitService: RecruitService,
    private comman_service:CommonService,
    private toastr:ToastrService
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getAllJob();


  }
  getAllJob() {
    this.recruitService.getAll_recruiment_report(this.entityId).subscribe((res: any) => {
      console.log(res);

      this.rowDataJob = res.data;

    })
  }



  openNav() {

    this.navWidth = 700;
  }

  closeNav() {
    this.navWidth = 0;
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'JD ID',
      field: 'jd_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Candidate Name ',
      field: 'first_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Email',
      field: 'email', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Start Date',
      field: 'start_date', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'End Date',
      field: 'end_date', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'status',
      field: 'selection_status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueFormatter: (params:any) => {
        return params.value === 'SELECTED' ? 'PENDING' : params.value;
      },
    },


  ];



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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

  }
  statusValue:any
  statuschange(event:any){
    if(event.value=='PENDING')
    this.statusValue='SELECTED';
  else
  this.statusValue=event.value;
  }
  Excel() {
    const filteredData = this.getFilteredData();

    if (filteredData && filteredData.length > 0) {
        try {
            this.comman_service.downloadCSV(filteredData);
            this.toastr.success('CSV downloaded successfully!');
        } catch (error) {
            console.error('Error downloading CSV:', error);
            this.toastr.error('An error occurred while downloading the file.');
        }
    } else {
        this.toastr.error('No records found to download.');
    }
}

  getFilteredData() {
    
    return this.rowDataJob.filter((job:any) => {
      const matchesStatus = this.statusValue? job.selection_status == this.statusValue : true;
      const matchesStartDate = this.startDate ? new Date(job.start_date) >= new Date(this.startDate) : true;
      const matchesEndDate = this.endDate ? new Date(job.end_date) <= new Date(this.endDate) : true;
      return matchesStatus && matchesStartDate && matchesEndDate;
    });
  }

}


