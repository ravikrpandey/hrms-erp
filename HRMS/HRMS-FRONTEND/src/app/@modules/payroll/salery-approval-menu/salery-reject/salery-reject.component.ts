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
// import { SalaryProcessActionComponent } from '../salary-process-action/salary-process-action.component';
import { TaxSlabService } from 'src/app/@shared/services/payroll/tax-slab.service';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { SaleryApprovActionComponent } from '../salery-approv-action/salery-approv-action.component'

@Component({
  selector: 'app-salery-reject',
  templateUrl: './salery-reject.component.html',
  styleUrls: ['./salery-reject.component.scss']
})
export class SaleryRejectComponent {
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
    dataList: any;
  
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
    branchList: any;
    constructor(
      private route: Router,
      private toaster: ToastrService,
      private activeRoute: ActivatedRoute,
      public dialog: MatDialog,
      private _rbackService: RbacMasterService,
      private _taxSlabService: TaxSlabService,
      private _commonService: CommonService,
      private $miscellaneous: MiscellaneousService,
      private _salaryProcessService: SalaryProcessService,
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
      this.employeeList_BY_processID()
      let currentDate = new Date()
      this.paySlipDate = currentDate.getDate() - 1;
      this.currentMonth = currentDate?.getMonth() + 1;
      let currentYear = currentDate.getFullYear();
      if(this.currentMonth === 1){
        this.selectedMonth = 12;
        this.selectedYear=currentYear - 1;

    }else{
      this.selectedMonth = this.currentMonth - 1;
      this.selectedYear=currentYear;
    }
  this.getAllBranchList()
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
      },
      {
        headerName: 'Process Id',
        field: 'process_id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'No of Employee',
        field: 'no_of_employee',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Pay Slip Month',
        field: 'pay_slip_month',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Pay Slip Year',
        field: 'pay_slip_year',
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
        cellRenderer: SaleryApprovActionComponent,
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
  
    employeeList_BY_processID = () => {
      try {
        let req = {
          // entity_id: this.entity_id,
          // financial_year_id: this.financial_id,
          // branchId:this.branch
          login_id:this.loginUserDetails?.employee_id,
          entity_id:this.entity_id,
          financial_year_id:this.financial_id
        }
        // this._commonService?.showLoader();
        this._salaryProcessService.getSaleryRejectLIst(req).subscribe((res) => {
          // this._commonService?.hideLoader()
          if (res) {
            this.rowData = res.data;
            this.rowData?.map((item: any) => {
              // let obj = this.monthList?.find((elem: any) => elem?.value == item?.pay_slip_month);
              // item.pay_slip_month = obj?.label;
              item.checkStatus="rejectData"
            })
            console.log(this.rowData,'this.rowData');
            
            this.dataList = this.rowData;
          }
        }, err => {
          this.rowData=[]
          // this._commonService?.hideLoader()
          console.log(err)
        })
      } catch (err) {
        // this._commonService?.hideLoader()
        console.log(err)
        this.rowData=[]
      }
    }
  
  
    // Filter start
    selectedMonth: any;
    selectedYear: any;
    branch:any;
    // Financ year get start
    financialYearList: any = [];
    getFinancialYear() {
      this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
        if (res) {
          this.financialYearList = res?.data;
          this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
  
          let currentDate = new Date();
          let currentYear = currentDate.getFullYear();
          let financial_id = localStorage.getItem("financial_id");
          // if (financial_id) {
          //   this.selectedYear = Number(financial_id);
          // }
          // else {
          //   let findObj = this.financialYearList?.find((elem: any) => elem?.financial_year == currentYear);
          //   this.financial_id = findObj?.id;
          // }
        }
      })
    }
  
    changeYear() {
      let financialObj = this.financialYearList?.find((elem: any) => elem?.id == this.selectedYear)
      let tempList = this.dataList?.filter((elem: any) => elem?.pay_slip_year == financialObj?.financial_year);
      this.rowData = tempList;
    }
  
    monthFilter() {
      let financialObj = this.financialYearList?.find((elem: any) => elem?.id == this.selectedYear)
      let monthObj = this.monthList?.find((elem: any) => elem?.value == this.selectedMonth)
      let tempList = this.dataList?.filter((elem: any) => (elem?.pay_slip_month == monthObj?.label && elem?.pay_slip_year == financialObj?.financial_year));
      this.rowData = tempList;
    }
  
    changeBranch(){
      let financialObj = this.financialYearList?.find((elem: any) => elem?.id == this.selectedYear);
      let monthObj = this.monthList?.find((elem: any) => elem?.value == this.selectedMonth)
      let branchObj = this.branchList?.find((elem: any) => elem?.id == this.branch)
  
      let tempList = this.dataList?.filter((elem: any) => (elem?.pay_slip_month == monthObj?.label && elem?.pay_slip_year == financialObj?.financial_year));
  
  
    }
  }
