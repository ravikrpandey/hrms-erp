import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { PaySlipService } from 'src/app/@shared/services/payroll/pay-slip.service';
import { SaleryApproverProcessComponent } from '../salery-approver-process/salery-approver-process.component';
import Swal from 'sweetalert2';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';

@Component({
  selector: 'app-salery-approv-action',
  templateUrl: './salery-approv-action.component.html',
  styleUrls: ['./salery-approv-action.component.scss']
})
export class SaleryApprovActionComponent {
  paramsVal: any;
  assignAction: any;
  editDataParams: any = 'edit'
  viewDataParams: any = 'view'
  public cellValue: any;
  loginUserDetails: any;
  baseUrl: any;
  getData: any;
  idEmp:any;
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
    private  _saleryService:SalaryProcessService
  ) {
  }
  ngOnInit(): void {
    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(loginUserDetails);
    this.financial_id = localStorage.getItem('financial_id');
        this.domain = localStorage.getItem('domain');

    
    this.baseUrl = environment?.serverUrl;
    this.idEmp=localStorage.getItem('EmpMainId');
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

    this.route.navigate(['master/payroll/salary-approval/salery-pending-list'], { queryParams: { id: this.singleData?.id, month: this.singleData?.selectedMonth } })
  }

  viewApproved() {

    this.route.navigate(['master/payroll/salary-approval/salery-approver'], { queryParams: { id: this.singleData?.id, month: this.singleData?.selectedMonth } })
  }

  viewDetail() {
  
    this.route.navigate(['master/payroll/pay-slip/view-detail'], { queryParams: { id: this.singleData?.employee_id, month: this.singleData?.pay_slip_month } })
  }

  goEmployee(){
    this.route.navigate(['master/payroll/salary-approval/reject-employe'], { queryParams: { id: this.singleData?.id, month: this.singleData?.selectedMonth } })

  }
  openDialog(e:any){
  
     
      e.stopPropagation();
      Swal.fire({
        title: 'Do You Want to Re-running payrol This?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            status:"REJECTED",
            login_id:this.idEmp,
          };
        console.log(data);
        
          this._saleryService.payrolApprover(data).subscribe((res: any) => {
            // this._commonService?.hideLoader()
            this.getData = res.data;
            // this.dialog.close()
            if(res.code ==200){
              this.toaster.success(res.message);
                  
            }
            window.location.reload();
            
          },(err:any) => {
            // this._commonService?.hideLoader()
          })
        }else{
    
        }
      });
 


  }
  check(e:any){
    e.stopPropagation();
    
  }
}
