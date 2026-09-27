import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveTypeActionComponent } from './leave-type-action/leave-type-action.component';
import { LeaveTypeDialogComponent } from './leave-type-dialog/leave-type-dialog.component';
import { LeaveStatusComponent } from './leave-status/leave-status.component';

@Component({
  selector: 'app-leavetype',
  templateUrl: './leavetype.component.html',
  styleUrls: ['./leavetype.component.scss']
})
export class LeavetypeComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  dropVal:any = [{name:'Yes',value:true},{name:'No',value:false}]

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this._configurationalMasterService.listLeave().subscribe((res: any) => {
      let modifyData:any = [];
      for(let i = 0; i < res.data.length; i++) {
        if(res.data[i].is_carry_forward){
          modifyData.push({...res.data[i], is_carry_forward:'Yes'})
        }else{
          modifyData.push({...res.data[i], is_carry_forward:'No'})
        }
        this.rowData = modifyData;
      }
      
      this.rowData = modifyData;
      
    });
  }
  public columnDefs = [
    {
      headerName: 'S.NO',
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
      headerName: 'Leave Type',
      field: 'leave_type',
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
      headerName: 'Total Leave Days',
      field: 'number_of_leave',
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
      headerName: 'Carry Forward Leave',
      field: 'is_carry_forward',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth:150,
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['No','Yes']
      },
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: LeaveStatusComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
     
      // editable:true
    },
    {
      headerName: 'Action',
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: LeaveTypeActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    

    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without fill!");
    }
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

  getCountry() {
    this._configurationalMasterService.listLeave().subscribe((res: any) => {
      let modifyData:any = [];

      for(let i = 0; i < res.data.length; i++) {
        if(res.data[i].is_carry_forward){
          modifyData.push({...res.data[i], is_carry_forward:'Yes'})
        }else{
          modifyData.push({...res.data[i], is_carry_forward:'No'})
        }
        this.rowData = modifyData;
      }
      
    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let value = event.data;
    
    
    if (value.leave_id) {
      let body:any = {
        leave_type: value.leave_type,
        number_of_leave: value.number_of_leave,
        // is_carry_forward:value.is_carry_forward
      };
      if(value.is_carry_forward){
        let fr = this.dropVal.find((x:any) => x.name === value.is_carry_forward)
        body.is_carry_forward = fr.value;
      }
      

      

    }else{
      if(value.leave_type && value.number_of_leave && value.is_carry_forward){
        let body:any = {
          leave_type: value.leave_type,
          number_of_leave: value.number_of_leave,
          // is_carry_forward:value.is_carry_forward
        };
        if(value.is_carry_forward){
          let fr = this.dropVal.find((x:any) => x.name === value.is_carry_forward)
          body.is_carry_forward = fr.value;
        }
        
        this.createLeaveType(body);

      }else{
        this.toaster.warning("Fill all fields 'Leave Type' , 'Total Leave Days' and 'Carry Forward Leave'")
      }
    };
  }
  createLeaveType(data: any) {
    this._configurationalMasterService .createLeave(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Created Succesfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          "leave_type is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
openDialog()
{
  const dialogRef = this.dialog.open(LeaveTypeDialogComponent, {
    width: '500px',
    data: { addLeave:'add_leave'},
  });
  dialogRef.afterClosed().subscribe((result) => {
    
  });
}

  onCellClicked(e: any) {
    
    const dialogRef = this.dialog.open(LeaveTypeActionComponent, {
      width: '400px',
      data: {
        role_master_id: e.data.role_master_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
