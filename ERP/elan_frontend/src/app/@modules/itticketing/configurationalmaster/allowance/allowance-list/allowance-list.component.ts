import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BehaviorSubject } from 'rxjs';
import { DepartmentComponent } from '../../department/department.component';
import { AllowanceCreateComponent } from '../allowance-create/allowance-create.component';
import { ActionComponent } from './action/action.component';
import { AlloanceActionStatusComponent } from './action/alloance-action-status/alloance-action-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-allowance-list',
  templateUrl: './allowance-list.component.html',
  styleUrls: ['./allowance-list.component.scss']
})
export class AllowanceListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  assignAction: any;
  columnDefs: any[] = [
    {
      headerName: "S.No",
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
      headerName: "Allowance Name",
      field: 'allowance_name',
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
      headerName: "Domestic Allowance",
      field: 'domestic_allowance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "International Allowance",
      field: 'international_allowance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: 'entity_status',
      cellRenderer: AlloanceActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 100,
    },
    {
      headerName: "Action",
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
  AllowanceList: any
  domestics_Allowance: any;
  international_Allowance: any;

  financial_year_id: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getDepartment();


    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getDepartment() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    }
    this._commonService.showLoader()
    this._configurationalMasterService.getAllAllownce(req).subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService.hideLoader()

    }, (err: any) => {
      this._commonService.hideLoader()
      this.rowData = []
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  openDialog() {
    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
      next: (res: any) => {

        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
        if (!isExistData && res.code === 200) {
          this.toaster.warning(res.message);
          return
        }
        if (!isExistData && res.code === 201) {
          this.toaster.warning(res.message);
          return
        }
        const dialogRef = this.dialog.open(AllowanceCreateComponent, {

          width: '35%',
          data: { mode: 'add' },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
      }, error: (err) => {
        console.log(err)
        this.toaster.warning(err.error.message);
        return
      },
    })
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
}