import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { TaxSlabService } from 'src/app/@shared/services/service/payroll/tax-slab.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
import { EmployeeAttendanceActionComponent } from '../employee-attendance-action/employee-attendance-action.component';
import { TaxSlabService } from 'src/app/@shared/services/payroll/tax-slab.service';
import { SalaryDetailService } from 'src/app/@shared/services/payroll/salary-detail.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
// import { SalaryDetailService } from 'src/app/@shared/services/service/payroll/salary-detail.service';

@Component({
  selector: 'app-employee-attendance-list',
  templateUrl: './employee-attendance-list.component.html',
  styleUrls: ['./employee-attendance-list.component.scss']
})
export class EmployeeAttendanceListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  add_Emp: any = 'Add_Emp'
  entity_id: any;
  financial_id: string | null;
  assignAction: any;
  loginUserDetails: any;
  currentMonth: any;
  paySlipDate: any;
 filtermonths: any[] = [];
  monthList = [
    { "value": 1, "label": "January" },
    { "value": 2, "label": "February" },
    { "value": 3, "label": "March" },
    { "value": 4, "label": "April" },
    { "value": 5, "label": "May" },
    { "value": 6, "label": "June" },
    { "value": 7, "label": "July" },
    { "value": 8, "label": "August" },
    { "value": 9, "label": "September" },
    { "value": 10, "label": "October" },
    { "value": 11, "label": "November" },
    { "value": 12, "label": "December" }
  ];
  public gridOptions: any = { rowSelection: 'multiple', };
  monthList2 = [...this.monthList]; 
  months: any = this.monthList.map((item: any) => item.label)
  branchList: any;
  cycleRange: any;
  fromDate: any = null;
  toDate: any = null;
  fromSelect: any;
  toSelect: any;
  constructor(
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private _taxSlabService: TaxSlabService,
    private _commonService: CommonService,
    private $miscellaneous: MiscellaneousService,
    private _salaryDetailService: SalaryDetailService,
    private payrollService: PayrollService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();

    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(loginUserDetails);

    this.getFinancialYear()
    this.getAllPayrollCycleData();


    let currentDate = new Date()
    this.paySlipDate = currentDate.getDate() - 1;
    this.currentMonth = currentDate?.getMonth() + 1;

    let currentYear = currentDate.getFullYear();
    if (this.currentMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear = currentYear - 1;
    } else {
      this.selectedMonth = this.currentMonth - 1;
      this.selectedYear = currentYear
    }
    console.log(this.selectedMonth, 'this.selectedMonth');
 this.filtermonths = [...this.monthList];
    this.registrationall();
  }

  onCycleChange(event: any): void {
    // Extract the selected range (e.g., "1 to 24")

    const selectedRange = String(event.value);

    // Parse the range string to extract the 'from' and 'to' integers
    const [from, to] = selectedRange.split(' to ').map((num: any) => parseInt(num.trim(), 10));
    this.fromSelect = from;
    this.toSelect = to;
    // Get the current month and year
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based index (0 = January)
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    // Prepare fromDate and toDate
    const fromDate = this.prepareDate(from, this.selectedMonth, this.selectedYear);
    const toDate = this.prepareDate(to, this.selectedMonth, this.selectedYear);
    // Format the dates as yyyy-MM-dd
    const formattedFromDate = this.formatDate(fromDate);
    const formattedToDate = this.formatDate(toDate);
    this.fromDate = formattedFromDate
    this.toDate = formattedToDate
    // You can now use these formatted dates (formattedFromDate, formattedToDate) in your API calls or any other logic
  }

  // Function to prepare a Date object from a day, month, and year
  prepareDate(day: number, month: number, year: number): Date {
    return new Date(year, month, day); // Date(year, month, day)
  }

  // Function to format the Date object to 'yyyy-MM-dd'
  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getAllPayrollCycleData() {
    this.payrollService.getPayrollRangeActive(this.entity_id, this.financial_id).subscribe((res: any) => {
      if (res && res.data) {
        this.cycleRange = res.data
        this.cycleRange = this.cycleRange.map((value: any) => {
          value.range = value.start_date + " to " + value.end_date
          return value
        })
      }
    }, err => {
      this.toaster.error(err.error.message)
    })
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 75,
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Name',
      valueGetter: (params: { data: { first_name: any; last_name: any; }; }) => `${params.data.first_name} ${params.data.last_name}`,
      field: 'full_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    { headerName: 'P', field: 'total_P', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'DP', field: 'total_DP', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'A', field: 'total_A', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'DA', field: 'total_DA', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'PFD', field: 'total_PFD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'PHD', field: 'total_PHD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'HPFD', field: 'total_HPFD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'HPHD', field: 'total_HPHD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'NPFD', field: 'total_NPFD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'NPHD', field: 'total_NPHD', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'UL', field: 'total_UL', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'UHL', field: 'total_UHL', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'CO', field: 'total_CO', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'WFO', field: 'total_WFO', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'WHO', field: 'total_WHO', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    { headerName: 'H', field: 'total_H', cellClass: 'grid-cell-centered', flex: 1, minWidth: 100 },
    {
      headerName: 'Paid Days Equivalent',
      field: 'total_paid_days',
      flex: 1,
      minWidth: 200,
      cellClass: 'grid-cell-centered',
      valueGetter: (params: any) => {
        const t = params.data;
        const paidEquivalent =
          (parseInt(t.total_P) || 0) +
          (parseInt(t.total_H) || 0) +
          (parseInt(t.total_DP) || 0) +
          (parseInt(t.total_WFO) || 0) +
          (parseInt(t.total_WHO) || 0) +
          (parseInt(t.total_PFD) || 0) +
          (parseInt(t.total_HPFD) || 0) * 0.5 +
          (parseInt(t.total_PHD) || 0) +
          (parseInt(t.total_HPHD) || 0) * 0.75;
        return paidEquivalent.toFixed(2);
      }
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: EmployeeAttendanceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    }
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  openDialog() {
    this.route.navigate(['/master/hrms/payroll/tax-slab-create'])
  }

  monthSearch(filteredLabels: string[]) {
  if (!filteredLabels || filteredLabels.length === 0) {
    this.monthList = [...this.monthList2]; // Reset full list
  } else {
    this.monthList = this.monthList2.filter((item: any) =>
      filteredLabels.includes(item.label)
    );
  }
}


  // monthSearch(e: any) {
  //   const aa = e
  //   let filteredVariable = this.monthList2.filter((item: any) => aa.includes(item.label));
  //   this.monthList = filteredVariable
  // }

  registrationall = () => {
    try {
      let req = {
        entity_id: this.entity_id,
        att_month: this.selectedMonth,
        financial_year_id: this.financial_id,
        att_year: this.selectedYear
      }
      // this._commonService?.showLoader();
      this._salaryDetailService.employee_AttendanceDetails(req).subscribe((res) => {
        // this._commonService?.hideLoader()
        if (res) {
          this.rowData = res.data;

          this.rowData.map((row: any) => {
            row.full_name = row.first_name + " " + row.last_name;
            row.selectedMonth = this.selectedMonth;
            if (!row?.pay_slip_status) row.pay_slip_status = 'HOLD';
            return row
          })
        }
      }, err => {
        // this._commonService?.hideLoader()
        console.log(err)
      })
    } catch (err) {
      // this._commonService?.hideLoader()
      console.log(err)
    }
  }


  // Filter start
  selectedMonth: any;
  selectedYear: any;
  // Financ year get start
  financialYearList: any = [];
  getFinancialYear() {

    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
      }
    })
  }

  changeYear() {
    this.registrationall();
  }

  selectedLeadList: any = [];
  onSelectionChanged(event: any): void {

    this.selectedLeadList = [];
    let selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows?.length) {
      selectedRows?.map((item: any) => {
        this.selectedLeadList.push({ employee_id: item?.employee_id })
      })
    }
    console.log('Selected Rows:', selectedRows, this.selectedLeadList);
  }

  generateAttendance() {

    console.log(this.fromSelect);
    console.log(this.selectedMonth);
    console.log(this.selectedYear);
    console.log(this.toSelect);
    if (!this.selectedYear || !this.fromSelect || !this.selectedMonth) {
      this.toaster.error('All Fileds Are Required');
      return
    }

    if (this.selectedMonth === 12) {
      var changeMonth: any = 1
    } else {
      var changeMonth: any = this.selectedMonth + 1
    }

    this._salaryDetailService.total_MonthlyAttendance(this.fromSelect, this.toSelect, this.entity_id, this.financial_id, changeMonth, this.selectedMonth, this.selectedYear).subscribe((res) => {
      if (res) {
        this.toaster.success(res?.message);
        this.registrationall();
      }
    },
      ((err: any) => {
        this.toaster.error(`${err?.error?.message}`)
      })
    )
  }

}
