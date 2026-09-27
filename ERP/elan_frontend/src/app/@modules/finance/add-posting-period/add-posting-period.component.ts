import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { an } from '@fullcalendar/core/internal-common';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value?.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-posting-period',
  templateUrl: './add-posting-period.component.html',
  styleUrls: ['./add-posting-period.component.scss']
})
export class AddPostingPeriodComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  assignAction: any;

  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  chartId: any;
  employeeDetails: any = [];
  loginUser: any;
  item_masterData: any;
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  getSubtypeAccount_data: any;
  financialYearNameList: any[] = [];
  monthNameList: any[] = [];
  entity_id: any;
  posting_period_id: any;

  monthList: Month[] = [
    { month: 'January', status: 'INACTIVE' },
    { month: 'February', status: 'INACTIVE' },
    { month: 'March', status: 'INACTIVE' },
    { month: 'April', status: 'INACTIVE' },
    { month: 'May', status: 'INACTIVE' },
    { month: 'June', status: 'INACTIVE' },
    { month: 'July', status: 'INACTIVE' },
    { month: 'August', status: 'INACTIVE' },
    { month: 'September', status: 'INACTIVE' },
    { month: 'October', status: 'INACTIVE' },
    { month: 'November', status: 'INACTIVE' },
    { month: 'December', status: 'INACTIVE' },
  ];

  additionalMonthList = [
    { id: 1, month: 'January', status: 'INACTIVE', isActive: false },
    { id: 2, month: 'February', status: 'INACTIVE', isActive: false },
    { id: 3, month: 'March', status: 'INACTIVE', isActive: false },
    { id: 4, month: 'April', status: 'INACTIVE', isActive: false },
    { id: 5, month: 'May', status: 'INACTIVE', isActive: false },
    { id: 6, month: 'June', status: 'INACTIVE', isActive: false },
    { id: 7, month: 'July', status: 'INACTIVE', isActive: false },
    { id: 8, month: 'August', status: 'INACTIVE', isActive: false },
    { id: 9, month: 'September', status: 'INACTIVE', isActive: false },
    { id: 10, month: 'October', status: 'INACTIVE', isActive: false },
    { id: 11, month: 'November', status: 'INACTIVE', isActive: false },
    { id: 12, month: 'December', status: 'INACTIVE', isActive: false },
  ];

  displayedColumns: string[] = ['sno', 'month', 'status'];
  fiscalYearDate: any[] = [];
  additionalMonthsList: any[] = [];
  additionalStart: any;
  additionalEnd: any;
  year_start_date: any;
  year_end_date: any;

  toggleStatus(selectedElement: Month) {
    for (let element of this.monthList) {
      const isSelected = element === selectedElement && !element.isDisabled;
      element.isActive = isSelected;
      element.status = isSelected ? 'ACTIVE' : 'INACTIVE';
    }
  }

  toggleStatus1(selectedElement: Month) {
    for (let element of this.additionalMonthsList) {
      const isSelected = element === selectedElement;
      element.isActive = isSelected;
      element.status = isSelected ? 'ACTIVE' : 'INACTIVE';
    }
  }

  constructor(private location: Location,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      period_name: new FormControl('', [Validators.required, noLeadingSpaces()]),
      from_month: new FormControl(''),
      to_month: new FormControl(''),
      status: new FormControl('ACTIVE'),
      financial_year_id: new FormControl('', [Validators.required]),
      is_additional_months: new FormControl(false)
    });
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getMonthList();
    this.getFromToMonthByEntityId();
    this.getFinancialYearList();
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.chartId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.chartId) {
      this.getPostingPeriodById();
    }
  }

  get CF_3(): any {
    return this.form.controls;
  }

  goBack() {
    this.router.navigate(['master/finance/posting-period'])
  }

  list: any[] = [];

  onSubmit(data: any) {
    if (this.form.get('is_additional_months')?.value) {
      data.additionalMonthsList = this.additionalMonthsList.map(month => ({
        month: month.month,
        status: month.status
      }))
    }

    data.monthList = this.monthList.map(month => ({
      month: month.month,
      status: month.status
    }));
    let fromMonth = this.form.get('from_month')?.value
    let toMonth = this.form.get('to_month')?.value
    data.from_month = moment(fromMonth).format('MM')
    data.to_month = moment(toMonth).format('MM')
    if (this.chartId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }
      this._finaceservice.addPostingPeriod(this.chartId, data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['master/finance/posting-period'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.chartId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.toaster.error('Please fill the mandatory fields!', 'Error Message')
        return
      }
      data.entity_id = this.entity_id
      this._finaceservice.addPostingPeriod(this.chartId, data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['master/finance/posting-period'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }
  }

  getPostingPeriodById() {
    this.additionalMonthsList = [];
    this._finaceservice.getPostingPeriodById(this.chartId).subscribe((response: any) => {
      const id = response.data[0]?.id;
      this.posting_period_id = response.data[0]?.id;

      this._finaceservice.getPostingPeriodMonthListById(id).subscribe((res: any) => {
        this.monthList = this.monthList.map((month, index) => {
          const apiMonth = res.data.find((m: any) => m.month === month.month);
          return {
            ...month,
            status: apiMonth ? apiMonth.status : 'INACTIVE',
            isActive: apiMonth ? apiMonth.status === 'ACTIVE' : false,
            isDisabled: true 
          };
        });

        if (response.data[0]?.is_additional_months) {
          this._finaceservice.getAdditionalPostingPeriodMonthListById(id).subscribe((res: any) => {
            this.additionalMonthsList = res.data.map((month: any) => ({
              ...month,
              isActive: month.status === 'ACTIVE',
            }));
            this.setActiveMonth();
          });
        }

        this.form.patchValue({
          period_name: response.data[0]?.period_name,
          financial_year_id: response.data[0]?.financial_year_id,
          from_month: response.data[0]?.year_start_date,
          to_month: response.data[0]?.year_end_date,
          is_additional_months: response.data[0]?.is_additional_months
        });

        this.setActiveMonths(response.data[0]?.from_month, response.data[0]?.to_month);
        this.cdr.detectChanges();
      });
    }, (err: any) => {
      this.toaster.error(err.error.message);
    });
  }

  getFinancialYearList() {
    this._finaceservice.getFinancialYearList(this.entity_id).subscribe((res: any) => {
      this.financialYearNameList = res.data;
    })
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onFiscalYearSelect(event: any) {
    this.form.get('is_additional_months')?.setValue(false);
    this.additionalMonthsList = [];
    let id = event?.value;
    this._finaceservice.getFromToMonthByFinancialYear(id).subscribe((res: any) => {
      const fromMonth = res.data[0]["from_month"];
      const toMonth = res.data[0]["to_month"];

      this.monthList = this.monthList.map(month => ({
        ...month,
        status: 'INACTIVE',
        isActive: false,
        isDisabled: true
      }));

      this.form.get('from_month')?.setValue(res.data[0].year_start_date);
      this.form.get('to_month')?.setValue(res.data[0].year_end_date);

      this.setActiveMonths(fromMonth, toMonth);
      this.cdr.detectChanges();
    })
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };

  getMonthList() {
    this._finaceservice.getMonthList().subscribe((res: any) => {
      this.monthNameList = res.data;
    })
  }

  setActiveMonth() {
    // This method is kept for additional months if needed
  }

  setActiveMonths(fromMonth: number, toMonth: number) {
    const start = fromMonth - 1; 
    const end = toMonth - 1;

    const isWrapping = fromMonth > toMonth;

    for (let i = 0; i < this.monthList.length; i++) {
      let inRange = false;

      if (isWrapping) {
        inRange = (i >= start) || (i <= end);
      } else {
        inRange = (i >= start && i <= end);
      }

      this.monthList[i].isDisabled = !inRange;

      if (inRange) {
        this.monthList[i].isActive = this.monthList[i].status === 'ACTIVE';
      } else {
        this.monthList[i].isActive = false;
        this.monthList[i].status = 'INACTIVE';
      }
    }
  }

  getFromToMonthByEntityId() {
    this._finaceservice.getFromToMonthByEntityId(this.entity_id).subscribe((res: any) => {
      const fromMonth = res.data[0]["from_month"];
      const toMonth = res.data[0]["to_month"];
      this.form.get('from_month')?.setValue(res.data[0].year_start_date);
      this.form.get('to_month')?.setValue(res.data[0].year_end_date);
      this.monthList = this.monthList.map(month => ({
        ...month,
        status: 'INACTIVE',
        isActive: false,
        isDisabled: true
      }));

      this.setActiveMonths(fromMonth, toMonth);
      this.cdr.detectChanges();
    });
  }
}

interface Month {
  month: string;
  status: string;
  isDisabled?: boolean;
  isActive?: boolean;
}