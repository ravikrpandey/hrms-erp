import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { TaxSlabService } from 'src/app/@shared/services/service/payroll/tax-slab.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
// import { SalaryProcessActionComponent } from '../salary-process-action/salary-process-action.component';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { TaxSlabService } from 'src/app/@shared/services/payroll/tax-slab.service';
import { SaleryApprovActionComponent } from '../salery-approv-action/salery-approv-action.component';
import { SaleryApproverProcessComponent } from '../salery-approver-process/salery-approver-process.component';
// import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog.component';

@Component({
  selector: 'app-salery-pending-list',
  templateUrl: './salery-pending-list.component.html',
  styleUrls: ['./salery-pending-list.component.scss']
})
export class SaleryPendingListComponent {

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
    salaryProcessId: any;
  
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
    constructor(
      private route: Router,
      private touteParams: ActivatedRoute,
      private toaster: ToastrService,
      private activeRoute: ActivatedRoute,
      public dialog: MatDialog,
      private _rbackService: RbacMasterService,
      private _taxSlabService: TaxSlabService,
      private _commonService: CommonService,
      private $miscellaneous: MiscellaneousService,
      private _salaryProcessService: SalaryProcessService,
    ) {
      this.rowClass = 'rowClass';
    }
    ngOnInit(): void {
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_id = localStorage.getItem('financial_id');
      this.assignAction = this._rbackService.accessAssignAction();
  
      let loginUserDetails: any = localStorage.getItem("loginUserDetails");
      this.loginUserDetails = JSON.parse(loginUserDetails);
  
      this.touteParams.queryParams.subscribe((params: any) => {
        this.salaryProcessId = params?.id;
        if (this.salaryProcessId) {
          this.employeeList_BY_processID()
        }
      });
  
      this.getFinancialYear()
  
    
      let currentDate = new Date()
      this.paySlipDate = currentDate.getDate() - 1;
      this.currentMonth = currentDate?.getMonth() + 1;
      // this.rowData = [
      //   {
      //     "id": 1,
      //     "employee_code": "0002",
      //     "employee_official_email": "ashu@gmail.com",
      //     "contact_number": 8007484848,
      //     "designation_name": "test",
      //     "basic_salary": 122333,
      //     "pay_slip_status": "Pending"
  
      //   },
      //   {
      //     "id": 2,
      //     "employee_code": "0002",
      //     "employee_official_email": "ashu@gmail.com",
      //     "contact_number": 8007484848,
      //     "designation_name": "test",
      //     "basic_salary": 122333,
      //     "pay_slip_status": "Pending"
  
      //   }
      // ]
    }
  
    public columnDefs = [
      // {
      //   headerName: '',
      //   // headerCheckboxSelection: true,
      //   width:30,
      //   checkboxSelection: (params: any) => {
      //     if (params.data.pay_slip_status === 'PROCESSED') {
      //       return true;
      //     }
      //     return false;
      //   },
      // },
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
        valueGetter: (params: { data: { first_name: any; last_name: any; }; }) => `${params.data.first_name} ${params.data.last_name}`,
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
        field: 'basic_salary',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
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
        headerName: 'Approval Status',
        field: 'approval_status',
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
  
    monthSearch(e: any) {
      const aa = e
      let filteredVariable = this.monthList2.filter((item: any) => aa.includes(item.label));
      this.monthList = filteredVariable
    }
  
    employeeList_BY_processID = () => {
      try {
  
        let req = {
          id: this.salaryProcessId,
        }
        // this._commonService?.showLoader();
        this._salaryProcessService.getSaleryPendingLIst(req).subscribe((res) => {
          // this._commonService?.hideLoader()
          if (res) {
            this.rowData = res.data;
          
            this.rowData?.map((item: any) => {
              item.actionType = 'view detail';
            })
          }
        }, err => {
          // this._commonService?.hideLoader()
          console.log(err)
        this.rowData=[]

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
  
    }
  
  
    onSubmit = () => {
      const selectedRows = this.gridApi.getSelectedRows();
      let data;
      data = selectedRows.map(row => {
        return { id : row.id }
      })
      if ( data.length == 0 ){
        this.toaster.error("Select Atleast One Request")
        return;
      }
      let body = {approval_data:data}
     console.log(body);
        const dialogRef = this.dialog.open(SaleryApproverProcessComponent, { width: '500px', data: body });
        dialogRef.afterClosed().subscribe(result => {
          
        })
    
 
      
    // this._salaryProcessService.createPayrollAppro(body).subscribe((res)=>{
    //   console.log(res)
    // })
   
    }
  }
