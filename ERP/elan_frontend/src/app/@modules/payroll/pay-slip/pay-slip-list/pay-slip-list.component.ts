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
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
@Component({
  selector: 'app-pay-slip-list',
  templateUrl: './pay-slip-list.component.html',
  styleUrls: ['./pay-slip-list.component.scss']
})
export class PaySlipListComponent {
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
  branchList: any;
  branch:any;
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
  monthList2: any = this.monthList;
  months: any = this.monthList.map((item: any) => item.label)
  dataList: any;
  cycleRange: any;
  allData: any;
  changeCntMonth: any;
  department_id:any;
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
    private _salaryProcessService: SalaryProcessService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();

    let loginUserDetails: any = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(loginUserDetails);
    this.department_id =localStorage.getItem('department_id')
    this.getFinancialYear()

    
    let currentDate = new Date()
    this.paySlipDate = currentDate.getDate() - 1;
    this.currentMonth = currentDate?.getMonth() + 1;

    this.changeCntMonth=this.currentMonth - 1
    this.currentYear = currentDate?.getFullYear();
    if(this.currentMonth === 1){
      this.selectedMonth = 12;
  }else{
    this.selectedMonth = this.currentMonth - 1;
  }
  console.log(this.selectedMonth);
  console.log(this.currentMonth);

  
    this.registrationall();
    this.getAllBranchList();
    this.getAllPayrollCycleData();
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

  getAllPayrollCycleData(){
    this.payrollService.getPayrollRangeActive(this.entity_id,this.financial_id).subscribe((res:any) => {
      if(res && res.data){
        this.cycleRange = res.data
        this.cycleRange = this.cycleRange.map((value:any) => {
          value.range = value.start_date + " to " + value.end_date
          return value
        })
      }
    },err => {
      this.toaster.error(err.error.message)
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
      // headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
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
    const aa = e
    let filteredVariable = this.monthList2.filter((item: any) => aa.includes(item.label));
    this.monthList = filteredVariable
  }

  registrationall = () => {
    try {
      
      let req = {
        entity_id: this.entity_id,
        pay_slip_month: this.selectedMonth,
        financial_year_id: this.financial_id,
        // branchId:this.branch,
        current_year:this.selectedYear
      }
      // this._commonService?.showLoader();
      this._paySlipService.registrationall_hold(req).subscribe((res) => {
        // this._commonService?.hideLoader()
        if (res) {
          this.rowData = res.data;
          this.allData=res.data;
          this.rowData.map((row: any) => {
            row.full_name = row.first_name + " " + row.last_name;
            row.selectedMonth = this.selectedMonth;
            if (!row?.pay_slip_status) {
              row.pay_slip_status = 'HOLD';
            } 
            // else if (row?.pay_slip_status == "INACTIVE") {
            //   row.pay_slip_status = 'HOLD';
            // }
            return row;
          });
          let tempList = this.rowData?.filter((elem: any) => elem?.pay_slip_status == 'HOLD' || elem?.pay_slip_status == 'INACTIVE');
          this.rowData = tempList;
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
        this.financialYearList?.map((item: any) => item.financial_year = Number(item?.financial_year));
        this.financialYearObj = this.financialYearList?.find((elem: any) => elem?.id == this.financial_id)
      }
    })
  }

  changeYear() {
    let financialObj = this.financialYearList?.find((elem: any) => elem?.id == this.selectedYear)
    let tempList = this.dataList?.filter((elem: any) => elem?.pay_slip_year == financialObj?.financial_year);
    this.rowData = tempList;
  }

  handleSubmit() {
    
    
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
        department_id:this.department_id
      }
      this._commonService?.showLoader();
      this._paySlipService.generate_SalarySlip(req).subscribe((res) => {
        this._commonService?.hideLoader();
        if(res.results[0].status==='failed'){
         return this.toaster.error(res.results[0].error)
        }
        if (res) {
          this.toaster.success(res?.message);
          this.registrationall()
        }
      },(error:any)=>{
        this._commonService?.hideLoader();
        this.toaster.error(error.message ||'Something went wrong')
      })
    
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

  employeeList_BY_processID = () => {
    try {
      let req = {
        entity_id: this.entity_id,
        financial_year_id: this.financial_id,
      }
      // this._commonService?.showLoader();
      this._salaryProcessService.salary_ProcessList(req).subscribe((res) => {
        // this._commonService?.hideLoader()
        if (res) {
          this.rowData = res.data;
          this.rowData?.map((item: any) => {
            let obj = this.monthList?.find((elem: any) => elem?.value == item?.pay_slip_month);
            item.pay_slip_month = obj?.label;
          })
          this.dataList = this.rowData;
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

  changeBranch(){
    console.log(this.branch,'branch');
    console.log(this.selectedYear,'this.selectedYear');
    console.log(this.selectedMonth,'this.selectedMonth');
    
    console.log(this.allData,'this.dataList');
    
    let financialObj = this.financialYearList?.find((elem: any) => elem?.id == this.selectedYear);
    let monthObj = this.monthList?.find((elem: any) => elem?.value == this.selectedMonth)
    let branchObj = this.branchList?.find((elem: any) => elem?.id == this.branch)
    let tempList = this.allData?.filter((elem: any) => (elem?.pay_slip_month == monthObj?.label && elem?.pay_slip_year == financialObj?.financial_year && elem?.primary_branch_id == this.branch));
console.log(tempList,'tempList<<<');

    this.rowData=tempList
  }



}
