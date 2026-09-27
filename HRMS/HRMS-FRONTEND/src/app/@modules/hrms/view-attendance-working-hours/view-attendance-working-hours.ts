import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-attendance-working-hours',
  templateUrl: './view-attendance-working-hours.html',
  styleUrls: ['./view-attendance-working-hours.scss'],
})
export class ViewAttendanceWorkingHours implements OnDestroy {
  gridColumnApi: any;
  gridApi: any;
  loading = false;
  rowData: any[] = [];
  deductionRules: any = []; 
  showRules = false;
  rulesDisplayedColumns: string[] = ['index', 'deduction_rule_name', 'no_of_occation'];
  rulesDataSource = new MatTableDataSource<any>([]);
  paginationPageSize = 10;
  
  private sub = new Subscription();
    rowClass: any;
  constructor(
    private route: ActivatedRoute,
    private hrmsService: HrServiceService,
    private toster: ToastrService
  ) {}

  ngOnInit() {
    const s = this.route.queryParams.subscribe((params) => {
      const payload: any = {
        emp_id: params['emp_id'] ?? params['employee_id'] ?? null,
        month: params['month'] ? +params['month'] : null,
        year: params['year'] ? +params['year'] : null,
        entity_id: params['entity_id'] ? +params['entity_id'] : null,
        shift_id: params['shift_id'] ? +params['shift_id'] : null,
      };

      Object.keys(payload).forEach(k => (payload[k] == null) && delete payload[k]);

      if (Object.keys(payload).length === 0) {
        this.toster.error('No query params provided to fetch attendance');
        return;
      }

      this.getbyIdBioAttOfEmp(payload);
    });

    this.sub.add(s);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  columnDefs = [
    { headerName: 'S.No',  valueGetter: (p:any) => p.node ? p.node.rowIndex + 1 : '', width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Date', field: 'att_date', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Total Hrs', field: 'total_working_hr', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Left Grace', field: 'left_grace_day', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Shift', field: 'shift_name', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Shift Time', field: 'shift_time', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, width: 180, cellClass:'grid-cell-centered' },

  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

  loadAttendanceData(data: any[]) {
    this.rowData = data;
    if (this.gridApi) this.gridApi.setRowData(this.rowData);
  }

  fetchRowDetails(row: any) {
    const payload = {
      employee_id: row.employee_id ?? row.emp_id,
      att_date: row.att_date,
      entity_id: row.entity_id,
      shift_id: row.shift_id
    };
   
    this.getbyIdBioAttOfEmp(payload, true);
  }


  getbyIdBioAttOfEmp(data:any, fromRow = false){
    const payload = {...data};
    this.loading = true;

    this.hrmsService.getbyIdBioAttOfEmp(payload)
      .pipe(finalize(()=> this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.toster.success(res?.message || 'Success');

          const received = res?.daily_data ?? res;
          this.deductionRules =res?.deduction_rules ;
          this.rulesDataSource.data = this.deductionRules;
          if (Array.isArray(received) && !fromRow) {
            this.loadAttendanceData(received);
          } else if (Array.isArray(received) && fromRow) {
            console.log('Row-level response array:', received);
          } else if (!Array.isArray(received)) {
            console.log('Response:', received);
          }
        },
        error: (err: any) => {
          const msg = err?.error?.message || 'Server error';
          this.toster.error(msg);
        }
      });
  }



  toggleRules() {
  this.showRules = !this.showRules;
}

  onPageSizeChanged(event: any) {
    const val = event?.value ?? event; 
    this.paginationPageSize = Number(val) || 10;
    if (this.gridApi && this.gridApi.paginationSetPageSize) this.gridApi.paginationSetPageSize(this.paginationPageSize);
  }

    onFilterTextBoxChanged(value: string) {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(value);
    }
  }
}
