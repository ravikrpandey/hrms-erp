import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ColDef,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { ActionJobComponent } from '../action-job/action-job.component';
import { WorkFlowListPopComponent } from '../work-flow-list-pop/work-flow-list-pop.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work-flow-job-list',
  templateUrl: './work-flow-job-list.component.html',
  styleUrls: ['./work-flow-job-list.component.scss']
})
export class WorkFlowJobListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;

  columnDefs: ColDef[] = [
    {
      headerName: "Sr. No",
      field: 'S.No',
      valueGetter: (params: any) => params.node.rowIndex + 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 0.5,
      minWidth: 80
    },
    {
      headerName: "Job Type",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const job = params.data?.job_name || '';
        const type = params.data?.budget_planning_type || '';
        return job + (type ? ' - ' + type : '');
      }
    },
    {
      headerName: "Department",
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'User Role',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data?.roleField?.[0]?.role_master_name || '';
      }
    },
    {
      headerName: 'User Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data?.roleField?.[0]?.first_name + " " + params.data?.roleField?.[0]?.last_name + " [" + params.data?.roleField?.[0]?.employee_code + "]" || '';
      }
    },
    {
      headerName: "Action",
      flex: 0.5,
      cellRenderer: ActionJobComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    }
  ];

  entity_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService,
    private router:Router
  ) {
    this.rowClass = 'rowClass'
  }


navigateTo(){
  this.router.navigate(['/master/workflow/work-flow-job/work-flow-create'])
}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getCountry();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {
    const dialogRef = this.dialog.open(WorkFlowListPopComponent, {
      data: { id: e.data.id },
      panelClass: 'custom-dialog-width'
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.countryss_id;
    let val = event.newValue;
    let sta = event.data;
    if (val == event.data.status) {
      this._configurationalMasterService.updateSingleCountry(id1, sta).subscribe(
        (res: any) => {
          this.toaster.success('Status Updated Successfully')
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');
        });
    }
  }

  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) { return; }
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
    this.count++
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);

      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add Country")
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
    this._commonService?.showLoader()
    this._configurationalMasterService.getAllWorkFlowJob(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
      ((err: any) => {
        this._commonService?.hideLoader()
        this.rowData = []
        this.toaster.error(`${err.error.message}`)
      })
    )
  }


 

}
let rowIdSequence = 100;


function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100)
  };

  return obj;
}