import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmployeeMapWithLevelActionComponent } from './employee-map-with-level-action/employee-map-with-level-action.component';

@Component({
  selector: 'app-employee-map-with-level',
  templateUrl: './employee-map-with-level.component.html',
  styleUrls: ['./employee-map-with-level.component.scss']
})
export class EmployeeMapWithLevelComponent {
  private gridApi!: GridApi<any>
  rowClass: any;
  rowData: any;
  id: any;

  constructor(
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    private toaster: ToastrService,
    private router: Router,
    private service: ConfigurationalmasterService,
    private route: ActivatedRoute,
  ) {
  }


  public columnDefs = [

    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Level',
      field: 'level',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 200,
      valueFormatter: (params: any) => {
        return params.value ? `Level ${params.value}` : '';
      }
    },
    {
      headerName: 'Employee Count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return Array.isArray(params.data?.employee_ids)
          ? params.data.employee_ids.length
          : 0;
      }
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: EmployeeMapWithLevelActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    }
  ];


  ngOnInit(): void {
    this.getAllEmpMappingLevel();

    this.route.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }



  createEmpMap() {
    this.router.navigate(["master/workflow/employee-map-level/create"])
  };

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

  getAllEmpMappingLevel() {
    this.service.getAllEmpMappingLevel().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }


}
