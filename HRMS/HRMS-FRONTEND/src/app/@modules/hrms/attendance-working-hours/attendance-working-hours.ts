import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ColDef, GridApi,  } from 'ag-grid-community';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { ActionStatusComponent } from '../shift-master/shift-list/action/action-status/action-status.component';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { ActionDeductionRules } from '../deduction-rules/deduction-rule-list/action-deduction-rules/action-deduction-rules';


@Component({
  selector: 'app-attendance-working-hours',
  templateUrl: './attendance-working-hours.html',
  styleUrls: ['./attendance-working-hours.scss'],
})
export class AttendanceWorkingHours {
  listData: any = [];
  rowData: any = [];
  showGrid: boolean = true;
  rowClass: any;
  paginationPageSize = 10;
  currentMonthFilter:any = null;
  selectedEntityId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shiftAllocatedservices: ShiftAllocationService,
    private hrmsService: HrServiceService,
      private service :ShiftServiceService,
  ) { }

  ngOnInit() {
    this.getAllBioAttOfEmp();
    this.getAllShift()
  }


columnDefs: ColDef[] = [
  {
    headerName: 'S.No',
    valueGetter: (params: any) => (params.node ? params.node.rowIndex + 1 : ''),
    width: 80,
    cellClass: 'grid-cell-centered'
  },

  {
    headerName: 'Emp ID',
    field: 'emp_id',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Employee Name',
    field: 'employee_name',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Department',
    field: 'department',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Month',
    field: 'month',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Year',
    field: 'year',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Entity ID',
    field: 'entity_id',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Shift ID',
    field: 'shift_id',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Total Working Hours',
    field: 'total_working_hours',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Present Days',
    field: 'present_days',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Total Occasions',
    field: 'total_occassions',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'After 2 Concessions',
    field: 'after_2_concessions',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'HOD Remarks',
    field: 'hod_remarks',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'HOD Approval',
    field: 'hod_approval',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered',
    valueFormatter: params => params.value === 1 ? 'Approved' : 'Pending'
  },
  {
    headerName: 'Leave Deduction',
    field: 'leave_deduction',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Leave Balance',
    field: 'leave_balance',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'LWP',
    field: 'lwp',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Remarks',
    field: 'remarks',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered'
  },
  {
    headerName: 'Deduction Rules',
    field: 'deduction_rules',
    sortable: true,
    resizable: true,
    width: 140,
    cellClass: 'grid-cell-centered',
    valueGetter: (params: any) => {
      const rules = params.data?.deduction_rules ?? [];
      return rules.length ? rules.map((r: any) => r.deduction_rule_name).join(', ') : '-';
    }
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

onMonthPicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value; // e.g. "2025-11"

    if (!val) {
      this.currentMonthFilter = null; // 👈 reset to null if user clears input
      this.getAllBioAttOfEmp();
      return;
    }

    const [yearStr, monthStr] = val.split('-');
    const payload = {
      year: parseInt(yearStr, 10),
      month: parseInt(monthStr, 10),
    };

    console.log('Month-Year Payload:', payload);
    this.currentMonthFilter = payload;

    this.getAllBioAttOfEmp();
    
  }
  entity_id: any;
  getAllShift() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.entity_id = parseInt(entity, 10); 
    } else {
      console.error("No selectedEntityId found in localStorage");
      return; 
    }
    this.service.getAllShift(this.entity_id).subscribe((res: any) => {
      this.listData = res.data;
      console.log("this.rowdata",  this.listData)
    });
  }

currentShift: any = '';
  getAllBioAttOfEmp() {
  let entity = localStorage.getItem('selectedEntityId');
  const payload: any = {
    year: this.currentMonthFilter?.year || '',
    month: this.currentMonthFilter?.month || '',
    shift_id: this.currentShift || '',
    entity_id:entity || '',
  };

  console.log('Final Payload =>', payload);
  console.log('Final Payload =>', payload);
    this.hrmsService.getAllBioAttOfEmp(payload).subscribe(
      (res: any) => {
        if (res && res.data) {
         
          this.rowData = res.data;
        } else {
          this.rowData = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.rowData = [];
      }
    );
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.paginationSetPageSize(this.paginationPageSize);
  }
 
    onShiftChanged(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.currentShift = val === 'ALL' ? 'ALL' : Number(val);
    console.log(this.currentShift)
    this.getAllBioAttOfEmp();
  }
}


