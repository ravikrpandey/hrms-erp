import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import moment from 'moment';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ProfileDialogComponent } from 'src/app/@modules/hrms/recuitment-module/candidate-profile/profile-dialog/profile-dialog.component';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { Location } from '@angular/common';
import { BomStatusComponent } from '../../bom-status/bom-status.component';
import { BomActionComponent } from '../../bom-action/bom-action.component';


@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.scss']
})
export class BomListComponent {
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowData: any = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;

  constructor(
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private productionService: ProductionService,
    private location: Location,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    let userLoginId: any = localStorage.getItem('EmpMainId')
    if (userLoginId) {
      this.getLeadFormSetup();
    }
  }

  // Get all start
  getLeadFormSetup() {
    try {
      this.productionService.getBomAllList().subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      minWidth: 80,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'BOM Type',
      field: 'bom_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Product Name',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Variant',
      field: 'product_variant',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Created By',
      field: 'first_name',
      flex: 1,
      minWidth: 150,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      
    },
    {
      headerName: 'Last Updated',
      field: 'updatedAt',
      flex: 1,
      minWidth: 150,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },   
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 150,
      cellRenderer: BomStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,  
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      flex: 1,
      minWidth: 150,
      cellRenderer:BomActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleActionData(data),
      },
    },
  ];

  handleActionData(data: any) {
    console.log('Data received from action component:', data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
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
    return
  }

  // Add modal open start
  openAddModal() {
    // const dialogRef = this.dialog.open(AddLeadFormSetupDialogComponent, {
    //   width: '600px',
    //   data: { id: this.candidate_id },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('Dialog closed with result:', result);
    //   this.getLeadFormSetup();
    // });
  }
  // Add modal open end

  goBack() {
    this.location.back();
  }

  onAgGridEvent(event: any) {
    this.getLeadFormSetup();
  }

}
