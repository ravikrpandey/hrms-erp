import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { DepartmentDialogComponent } from '../../department/department-dialog/department-dialog.component';
import { AddCostProfitCenterComponent } from '../add-cost-profit-center/add-cost-profit-center.component';
import { CostProfitTypeActionComponent } from '../cost-profit-type-action/cost-profit-type-action.component';

@Component({
  selector: 'app-cost-profit-center-list',
  templateUrl: './cost-profit-center-list.component.html',
  styleUrls: ['./cost-profit-center-list.component.scss']
})
export class CostProfitCenterListComponent {
  singleId:any;
  cellValue1:any; 
  assignAction: any;
  columnDefs:any;
  gridApi:any
  rowData:any;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private _commonService : CommonService
  ) {
    this.columnDefs = [
      {
        headerName: 'S.No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 0.5,
      },
      {
        headerName: 'Type',
        field: 'selected_type',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
      },
      {
        headerName: 'Name',
        field: 'name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
      },
      {
        headerName: 'Action',
        // field: 'status',
        cellRenderer: CostProfitTypeActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          someProperty: 'value',
        },
        cellClass: "grid-cell-centered",
        minWidth: 150,
      },
     
    ];

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllCostProfitType()
   }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  openDialog() {

    const dialogRef = this.dialog.open(AddCostProfitCenterComponent, {
    
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllCostProfitType()
    });
  }
  
  getAllCostProfitType() {
    this._configurationalMasterService.getCostProfitType(this.entity_id).subscribe(
      (res: any) => {
        this.rowData = res.data
      }, (err: any) => {
        
        this.toaster.error('data not found');
      }
    )
  };


  
  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }

  
}
