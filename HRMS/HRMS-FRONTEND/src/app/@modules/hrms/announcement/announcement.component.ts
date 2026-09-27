import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { ActionAnnouncementComponent } from './action-announcement/action-announcement.component';
@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent {
 rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  userRole: any;
  customS_data: number;
  getAllData: any;
  sortType: boolean;
  assignAction: any;
  getUserRole: any;
  entity_id:any;
  constructor(
    private hr_service: HrServiceService,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject;

    } else {
      console.log('Value for signInUser not found in localStorage');
    }
     this.entity_id = localStorage.getItem("selectedEntityId");

      this.getAll_Announcement();
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  };

 


  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Notice Title',
      field: 'notice_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
     
    }, 
{
  headerName: 'From Date',
  field: 'from_date',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  valueFormatter: (params:any) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  },
},
{
  headerName: 'To Date',
  field: 'to_date',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  valueFormatter: (params:any) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  },
},

  {
  headerName: 'Image',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  cellRenderer: (params: any) => {
    const imageUrl = `${environment.serverUrl}/uploaded_files/${params.data.file_Name}`;
    return `<img src="${imageUrl}" alt="Image" style="width: 100px; height: auto;" />`;
  }
},

    {
      headerName: 'Created By',
      field: 'created_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  

    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 120,
      cellRenderer: ActionAnnouncementComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, 
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  onBtnExportDataAsExcel() {
    this.gridApi.exportDataAsExcel({
      processRowGroupCallback: rowGroupCallback,
    });
  }

 
  onBtPrint() {
    window.print();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

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

  //   gridOptions = {
  //     // Add event handlers

  // }
  onCellClicked(e: any) {
  }
  getAll_Announcement(){
    this.hr_service.getAll_Announcement(this.entity_id,this.getUserRole.employee_id,this.getUserRole.role).subscribe((res:any)=>{
             if(res){
              this.rowData=res.data;
             }
    },(err:any)=>{

    })
  }

}

function myFunction() {
  alert('I am an alert box!');
}

function rowGroupCallback(params: any) {
  return params.node.key;
}

function setPrinterFriendly(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout('print');
}
function setNormal(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout(null);
}


