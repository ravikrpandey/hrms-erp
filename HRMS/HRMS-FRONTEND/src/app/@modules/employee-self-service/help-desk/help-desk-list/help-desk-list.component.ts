import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { ActionComponent } from './action/action.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-help-desk-list',
  templateUrl: './help-desk-list.component.html',
  styleUrls: ['./help-desk-list.component.scss']
})
export class HelpDeskListComponent implements OnInit {
  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction:any;
  
  constructor(private empMaster: EmpMasterService, private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
      this.rowClass = 'rowClass';
    }
    ngOnInit(): void {
      this.empMaster.getLoggedInListHelpDesk(localStorage.getItem('EmpMainId')).subscribe((res: any) => {
        const aa=res.data
        const newArray = aa.map((item:any, index:any) => ({ ...item, index: index + 1 }));
        this.rowData=newArray
        console.log(this.rowData,"rowdata");
})
    
    }
    
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }
  public columnDefs = [

    {
      headerName: 'S.No',
      field: "index",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex:1,
      minWidth:150 
    },
    {
      headerName: 'Subject',
      field: 'subject',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150  
    },
    {
      headerName: 'Requester',
      field: 'requester',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150  
    },
    // {
    //   headerName: 'Type',
    //   field: 'type_of_document',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150  
    // },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150  
    },
    {
      headerName: ' Date',
      field: 'createdAt',
      valueFormatter: function (params: any) {
        return moment.utc(params.value).format('DD/MM/YYYY');
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150  
    },
    {
      headerName: 'Status',
      field: 'status1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150  
    },

    {
      headerName: 'Action',
      field: 'helpDiskId',
      flex:1,
      minWidth:150 ,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  onCellClicked(e: any) {
    console.log(e,'eeeeeee');
    
    const dialogRef = this.dialog.open(AppListDialogComponent,{width:'400px',data:{helpDiskViewId:e.data.employee_helpDesk_id,index:e.data.index}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}
