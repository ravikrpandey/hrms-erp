import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-process-allowance',
  templateUrl: './process-allowance.component.html',
  styleUrls: ['./process-allowance.component.scss']
})
export class ProcessAllowanceComponent implements OnInit {
  monthList = [
    { value: 'January', label: 'January' },
    { value:"February", label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
  ];
  public gridOptions: any = { rowSelection: 'multiple', };
  currentYear: number = new Date().getFullYear();
  selectedMonth: number | null = null;
  dataList: any[] = [];
  rowData: any[] = [];
  allowanceList: any[] = [];
  selectedAllowance: any
  earningForm: FormGroup;
  typeCheck: any;
  earningCompList: any = []
  compList: any = [];
  allowanceForm: any
  calculationFlat: boolean = true;
  calculationPercentage: boolean = false;
  private gridApi!: GridApi<any>;
  rowClass: any;
  dataRow :any[] = []
  constructor(private http: HttpClient,
    private payrollService: PayrollService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.allowanceForm = this.fb.group({
      currentYear: [null],
      selectedMonth: [null],
      selectedAllowance: [null],
      calculation_type: [null],
      calculation_percentage: [null],
      calculation_amount: [null],

    })
  }

  ngOnInit(): void {
    this.filterByYear();
    this.fetchAllowances();
    this.getAllCreatedAllownceComp()
  }
  onSave() {
    console.log(this.allowanceForm.value,'this.earningForm.value');
const dataPush=[]

    let val= this.allowanceForm.value
const payload:any = {
  currentYear:this.currentYear,
  selectedMonth:val?.selectedMonth,
  selectedAllowance:val?.selectedAllowance,
  calculation_type:val?.calculation_type,
  calculation_percentage:val?.calculation_percentage,
  calculation_amount:val?.calculation_amount
}

this.dataRow.push(payload)
console.log(this.dataRow,'this.dataRow');
this.allowanceForm.get('selectedMonth')?.reset();
this.allowanceForm.get('selectedAllowance')?.reset();
this.allowanceForm.get('calculation_type')?.reset();
this.allowanceForm.get('calculation_percentage')?.reset();
this.allowanceForm.get('calculation_amount')?.reset();


  }
  onCalculationTypeChange(event: any) {
    const calculationType = event.value;

    if (calculationType === 'Flat Amount') {
      this.calculationFlat = true;
      this.calculationPercentage = false;

      this.earningForm.get('calculation_percentage')?.clearValidators();
      this.earningForm.get('calculation_percentage')?.setValue(null);
      this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
      this.earningForm.get('calculation_amount')?.setValidators([Validators.required]);
      this.earningForm.get('calculation_amount')?.updateValueAndValidity();
    } else if (calculationType === 'Percentage of') {
      this.calculationFlat = false;
      this.calculationPercentage = true;

      this.earningForm.get('calculation_amount')?.clearValidators();
      this.earningForm.get('calculation_amount')?.setValue(null);
      this.earningForm.get('calculation_amount')?.updateValueAndValidity();

      this.earningForm.get('calculation_percentage')?.setValidators([Validators.required, Validators.max(99), Validators.min(0)]);
      this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
    } else {
      this.earningForm.get('calculation_percentage')?.clearValidators();
      this.earningForm.get('calculation_percentage')?.setValue(null);
      this.earningForm.get('calculation_amount')?.clearValidators();
      this.earningForm.get('calculation_amount')?.setValue(null);
    }
  }

  fetchAllowances() {
    console.log('Fetching allowances...');
    this.payrollService.getAllReiembursementComponentList().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status) {
          console.log('Active Allowances:', res.data.filter((item: any) => item.is_active === 'Active'));
          this.allowanceList = res.data.filter((item: any) => item.is_active === 'Active');
        } else {
          this.allowanceList = [];
          this.toast.error('No active allowances found.');
        }
      },
      (err) => {
        console.error('Error fetching allowances:', err);
        this.toast.error('Error fetching allowances: ' + err.error.message);
        this.allowanceList = [];
      }
    );
  }


  filterByYear() {
    this.rowData = this.dataList.filter((item) => item.pay_slip_year === this.currentYear);
  }

  // monthFilter() {
  //   const monthObj = this.monthList.find((month) => month.value === this.selectedMonth);
  //   if (monthObj) {
  //     this.rowData = this.dataList.filter(
  //       (item) =>
  //         item.pay_slip_month === monthObj.label && item.pay_slip_year === this.currentYear
  //     );
  //   }
  // }

  earningObj: any;
  earningTypeChange(evnet: any, acitonType: any) {
    let value = evnet?.value;
    this.earningObj = this.earningCompList?.find((elem: any) => elem?.earning_type_code == value);
    if (value == 'BASIC1') {
      console.log(this.compList)
      this.earningForm?.patchValue({ earning_type: 'CTC' })
    }
    if (acitonType == 'change') {
      this.earningForm?.patchValue({ calculation_type: 'Percentage of' })
    }
  }
  selectionChange(e: any) {
    console.log(e, 'eeeee');

  }
  getAllCreatedAllownceComp() {
    this.payrollService.getAllEarningComponentList().subscribe((res: any) => {
      if (res && res.data) {
        this.compList = res.data;
        console.log(this.compList, 'this.compList<<<<<<<<<');

      }
    }, err => {
      this.toast.error(err.error.message);
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
        headerName: 'Year',
        field: 'currentYear',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Month',
        field: 'selectedMonth',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Allowance',
        field: 'selectedAllowance',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Flat / %',
        field: 'pay_slip_year',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
     {
        headerName: 'Value',
        field: 'calculation_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Branch',
        field: 'pay_slip_year',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
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

   
}
