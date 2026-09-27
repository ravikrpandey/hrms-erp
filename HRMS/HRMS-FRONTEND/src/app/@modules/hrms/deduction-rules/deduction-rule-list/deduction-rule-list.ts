import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridApi,  } from 'ag-grid-community';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { ActionDeductionRules } from './action-deduction-rules/action-deduction-rules';
import { ActionStatusComponent } from '../../shift-master/shift-list/action/action-status/action-status.component';

@Component({
  selector: 'app-deduction-rule-list',
  templateUrl: './deduction-rule-list.html',
  styleUrls: ['./deduction-rule-list.scss'],
})
export class DeductionRuleList {
  listData: any = [];
  rowData: any = [];
  showGrid: boolean = true;
  rowClass: any;
  selectedEntityId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shiftAllocatedservices: ShiftAllocationService,
    private hrmsService: HrServiceService,
  ) { }

  ngOnInit() {
    this.getAlldeductionrules();
  }

  getAlldeductionrules() {
    this.hrmsService.getAlldeductionrules().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.listData = res.data;
          this.rowData = res.data;
          console.log('API Response:', res);
        } else {
          console.error('Invalid response format', res);
          this.rowData = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.rowData = [];
      }
    );
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) => (params.node ? params.node.rowIndex + 1 : ''),
      width: 100,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Deduction Rule Name',
      field: 'deduction_rule_name',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'Deduction Type',
      field: 'deduction_type',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'From -Time',
      field: 'from_time',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 180,
      valueFormatter: (params) => {
        return params.value ? params.value.substring(0, 5) : '';
      },
    },
        {
      headerName: 'To -Time',
      field: 'to_time',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 180,
      valueFormatter: (params) => {
        return params.value ? params.value.substring(0, 5) : '';
      },
    },
    {
      headerName: 'Days Rebate',
      field: 'days_rebate',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 180,
    },
    {
      headerName: 'Deduction Action',
      field: 'deduction_action',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      width: 180,
    },

    {

      field: 'status',
      cellRenderer: ActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: "deduction_rule"
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'id',
      width: 200,
      cellClass: 'grid-cell-centered',
      cellRendererFramework: ActionDeductionRules,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  private gridApi!: GridApi<any>;
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

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

  onAdd() {
    this.router.navigate(['/master/hrms/deduction-rules-form']);
    console.log('hii');
  }

}
