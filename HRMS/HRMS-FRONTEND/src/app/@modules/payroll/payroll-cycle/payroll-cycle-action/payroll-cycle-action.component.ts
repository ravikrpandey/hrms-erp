import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-payroll-cycle-action',
  templateUrl: './payroll-cycle-action.component.html',
  styleUrls: ['./payroll-cycle-action.component.scss']
})
export class PayrollCycleActionComponent {
  constructor(
    private route: Router,
    private payrollService: PayrollService,
    private toaster: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }

  public toggleBind(){
    if(this.cellValue.status == "ACTIVE"){
        return true
    }else{
      return false
    }
  };

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e:any) {
    this.route.navigate(['master/payroll/payroll-cycle/create-payroll-cycle'], { queryParams: { payroll_cycle_id: this.cellValue.id } })
  }



  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  };

  toggle(event:any){
    const val = event.checked ? 'ACTIVE' : 'INACTIVE'
    const sta = event.checked ? "Activated" :"In_Activated"

    let data = { 
      status:val
    }

    this.payrollService.updatePayrollCycleStatus_byId(this.cellValue.id, data).subscribe((res:any) =>{
      if(res && res.code == 200){
        this.toaster.success(`The Payroll Cycle is ${sta} successfully.`);
        this.reloadCurrentRoute();
      }
    },err =>{
        this.toaster.error(err.error.message);
        this.reloadCurrentRoute();
    })
  };
 
}
