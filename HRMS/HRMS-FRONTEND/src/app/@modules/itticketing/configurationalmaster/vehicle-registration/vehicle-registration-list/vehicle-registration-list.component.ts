import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VehicleRegistrationActionComponent } from '../vehicle-registration-action/vehicle-registration-action.component';
import { VehicleRegistrationStatusComponent } from '../vehicle-registration-action/vehicle-registration-status/vehicle-registration-status.component';

@Component({
  selector: 'app-vehicle-registration-list',
  templateUrl: './vehicle-registration-list.component.html',
  styleUrls: ['./vehicle-registration-list.component.scss']
})
export class VehicleRegistrationListComponent {

  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;

  constructor(private empMaster: EmpMasterService,private _configurationalMasterService: ConfigurationalmasterService, private _rbackService: RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this._configurationalMasterService.getAllVehicleRegistration().subscribe((res: any) => {
      this.rowData = res.data
      this.assignAction = this._rbackService.accessAssignAction();
    }, (err : any) =>{
      this.rowData = [];
    }) 
  }

  public columnDefs = [

    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Registration Number',
      field: 'registration_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Model Year',
      field: 'model_year',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'TUV Validity',
      field: 'tuv_validity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },


    {
      headerName: 'Chassis Number',
      field: 'chassis_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
   
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: VehicleRegistrationStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: VehicleRegistrationActionComponent,
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


}

