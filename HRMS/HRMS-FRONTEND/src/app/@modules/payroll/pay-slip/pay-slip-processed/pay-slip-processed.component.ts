import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { TaxSlabService } from 'src/app/@shared/services/service/payroll/tax-slab.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PaySlipActionComponent } from '../pay-slip-action/pay-slip-action.component';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TaxSlabService } from 'src/app/@shared/services/payroll/tax-slab.service';
import { PaySlipService } from 'src/app/@shared/services/payroll/pay-slip.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-pay-slip-processed',
  templateUrl: './pay-slip-processed.component.html',
  styleUrls: ['./pay-slip-processed.component.scss']
})
export class PaySlipProcessedComponent {
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
  currentYear: any;
  paySlipDate: any;
  branch: any;
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

  filtermonths: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  monthList2: any = this.monthList;
  months: any = this.monthList.map((item: any) => item.label)
  branchList: any;
  changeCntMonth: any;
  constructor(
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private _taxSlabService: TaxSlabService,
    private _commonService: CommonService,
    private $miscellaneous: MiscellaneousService,
    private _paySlipService: PaySlipService,
    private payrollService: PayrollService,

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


    let currentDate = new Date()
    this.paySlipDate = currentDate.getDate() - 1;
    this.currentMonth = currentDate?.getMonth() + 1;
    this.changeCntMonth = this.currentMonth - 1

    this.currentYear = currentDate?.getFullYear();
    if (this.currentMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear = this.currentYear - 1;

    } else {
      this.selectedMonth = this.currentMonth - 1;
      this.selectedYear = this.currentYear;

    }

    this.registrationall();
    this.getAllBranchList();

    this.filtermonths = [...this.monthList];
  }
  getAllBranchList() {
    this.payrollService.getAllBranch().subscribe((res: any) => {
      if (res && res.data) {
        this.branchList = res.data;
      }
    }, err => {
      // this.toast.error(err.error.message);
    })
  }
  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      headerCheckboxSelection: true,
      checkboxSelection: (params: any) => {
        // Check the 'approval_status' field value for each row
        if (params.data && (params.data.pay_slip_status === 'INACTIVE')) {
          return false; // Disable checkbox if approval_status is APPROVED or REJECTED
        }
        return true; // Enable checkbox otherwise
      },
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Employee Name',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Email ID',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Mobile Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Position',
      field: 'designation_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Basic Salary',
      field: 'monthly_ctc',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        // Check specifically for 'null' value and return 0
        return params.value === null ? 0 : params.value;
      }
    },
    {
      headerName: 'Status',
      field: 'pay_slip_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: PaySlipActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
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

  monthSearch(e: any) {
    const aa = e.data.map((item: any) => item.label);  // extract string array
    let filteredVariable = this.monthList2.filter((item: any) => aa.includes(item.label));
    this.monthList = filteredVariable;
  }

  registrationall = () => {
    try {

      let req = {
        entity_id: this.entity_id,
        pay_slip_month: this.selectedMonth,
        financial_year_id: this.financial_id,
        branchId: this.branch,
        current_year: this.selectedYear
      }
      // this._commonService?.showLoader();

      this._paySlipService.registrationall(req).subscribe((res) => {
        // this._commonService?.hideLoader()
        if (res) {
          this.rowData = res.data;

          this.rowData.map((row: any) => {
            row.full_name = row.first_name + " " + row.last_name;
            row.selectedMonth = this.selectedMonth;
            if (!row?.pay_slip_status) row.pay_slip_status = 'HOLD';
            return row
          })
          console.log("111111111111111111", this.rowData)
          let tempList = this.rowData?.filter((elem: any) => elem?.pay_slip_status != 'HOLD');
          this.rowData = tempList;
          console.log("222222222222222222222", this.rowData)
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
  financialYearObj: any;
  getFinancialYear() {

    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
        this.financialYearObj = this.financialYearList?.find((elem: any) => elem?.id == this.financial_id)
      }
    })
  }

  changeYear() {

  }

  handleSubmit() {

    try {
      if (!this.selectedMonth) {
        return this.toaster.error('Month field is required');
      }
      if (!this.selectedLeadList?.length) {
        return this.toaster.error('Select at least one employee');
      }
    let req = {
      employee_id: this.loginUserDetails?.employee_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      att_month: this.selectedMonth,
      employee_list: this.selectedLeadList,
    }
    // this._commonService?.showLoader();
    this._paySlipService.generate_SalarySlip(req).subscribe((res) => {
      // this._commonService?.hideLoader();
      if (res) {
        this.toaster.success(res?.message);
        this.registrationall()
      }
    },
      ((err: any) => {
        this.toaster.error(`${err.error?.message}`)
      }))
    } catch (err) {
      this.toaster.error('error');
      // this._commonService?.hideLoader();
    }
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
  }

}
