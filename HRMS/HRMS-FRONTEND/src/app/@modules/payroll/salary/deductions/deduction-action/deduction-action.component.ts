import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-deduction-action',
  templateUrl: './deduction-action.component.html',
  styleUrls: ['./deduction-action.component.scss']
})
export class DeductionActionComponent {

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
      if(this.cellValue.is_active == "Active"){
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
      e.stopPropagation()

      this.route.navigate(['master/payroll/salary-components/deductions/deduction-create'], { queryParams: { deduction_id: this.cellValue.id,type:"View" } })
    }
  
    editForm(e:any){
      e.stopPropagation()
      this.route.navigate(['master/payroll/salary-components/deductions/deduction-create'], { queryParams: { deduction_id: this.cellValue.id,type:"Edit" } })

    }
  
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    };
  
    toggle(event:any){
      const val = event.checked ? 'Active' : 'Inactive'
      const sta = event.checked ? "Activated" :"In_Activated"
  
      let data = { 
        status:val
      }
  
      this.payrollService.updateDeductionStatus(this.cellValue.id, data).subscribe((res:any) =>{
        if(res && res.status){
          this.toaster.success(`The Deduction is ${sta} successfully.`);
          this.reloadCurrentRoute();
        }
      },err =>{
          this.toaster.error(err.error.message);
          this.reloadCurrentRoute();
      })
    };
   
}
