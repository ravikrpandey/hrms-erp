import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
import { environment } from 'src/app/environments/environment';
import { PaySlipService } from 'src/app/@shared/services/payroll/pay-slip.service';
@Component({
  selector: 'app-pay-slip-action',
  templateUrl: './pay-slip-action.component.html',
  styleUrls: ['./pay-slip-action.component.scss']
})
export class PaySlipActionComponent {
  paramsVal: any;
  assignAction: any;
  editDataParams: any = 'edit'
  viewDataParams: any = 'view'
  public cellValue: any;
  loginUserDetails: any;
  baseUrl: any;
  financial_id:any;
  domain: string | null;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _hrmMasterService: HrmServiceService,
    private _commonService: CommonService,
    private _paySlipService: PaySlipService,
  ) {
  }
  ngOnInit(): void {
    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(loginUserDetails);
    this.financial_id = localStorage.getItem('financial_id');
    this.domain = localStorage.getItem('domain');

    this.baseUrl = environment?.serverUrl;

    this.assignAction = this._hrmMasterService.accessAssignAction();
    console.log("assignAction", this.assignAction);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  singleData: any;
  agInit(params: ICellRendererParams): void {
    console.log(params,'params');
    
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view() {
    
 this.route.navigate(['master/payroll/process-salary/pay-slip-detail'], { queryParams: { id: this.singleData?.employee_id, month: this.singleData?.selectedMonth,per_month:this.singleData?.att_mon } })
  }

  edit(e:any){
    this.route.navigate(['master/payroll/process-salary/salery-update'], { queryParams: { employee_id: this.singleData?.employee_id, month: this.singleData?.selectedMonth } })

  }
}
