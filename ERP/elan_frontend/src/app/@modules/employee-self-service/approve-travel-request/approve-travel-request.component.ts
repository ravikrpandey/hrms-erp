import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-approve-travel-request',
  templateUrl: './approve-travel-request.component.html',
  styleUrls: ['./approve-travel-request.component.scss'],
})
export class ApproveTravelRequestComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  status: string = '0'; // Initial status for 'To be approved'
  rowClass: any;
  loginUser: any;
  entity_Id: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};

  constructor(private travelService: TravelRequestService) { }

  ngOnInit(): void {
    this.selectingtab()
    this.localStorage()
    this.loadGridData();
  }

  selectingtab(){
  this.travelService.currentStatus.subscribe(status => {
    if(status){
    this.status = status;
    }
  });
}

  
  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  ngAfterViewInit(): void {
    this.setTabIndexBasedOnStatus();
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Travel Request Number',
      field: 'travel_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Emp Name',
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
      headerName: 'Start Date',
      field: 'travel_from_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'End Date',
      field: 'travel_to_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'Status',
      field: 'approvel_status',
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
      field: 'action',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  formatDate(dateString:any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }

  tabs = [
    { label: 'To be approved' },
    { label: 'Approved' },
    { label: 'Rejected' },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  tabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.status = String(tabIndex);
    this.loadGridData();
  }

  loadGridData(): void {
    
    if(this.status =="0"){
      this.rowData=[]
    this.travelService.get_travel_levels_to_be_approved(this.loginUser.employee_id,this.entity_Id).subscribe(
      (res: any) => {
        this.rowData = res.data;
      },
      (err:any) => {
        console.error('Error fetching data', err.error.message);
      }
    );
  }else if(this.status =="1"){
      this.rowData=[]
    this.travelService.get_travel_approvals_list(this.loginUser.employee_id,this.entity_Id).subscribe(
      (res: any) => {
        this.rowData = res.data;
      },
      (err:any) => {
        console.error('Error fetching data', err.error.message);
      }
    );
  }else if(this.status =="2"){
    this.rowData=[]
    this.travelService.get_travel_rejected_approvals(this.loginUser.employee_id,this.entity_Id).subscribe(
      (res: any) => {
        this.rowData = res.data;
      },
      (err:any) => {
        console.error('Error fetching data', err.error.message);
      }
    );
  }
  }

  setTabIndexBasedOnStatus(): void {
    this.tabGroup.selectedIndex = parseInt(this.status, 10) || 0;
  }
}
