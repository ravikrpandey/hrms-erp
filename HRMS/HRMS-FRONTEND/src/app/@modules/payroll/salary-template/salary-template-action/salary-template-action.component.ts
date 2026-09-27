import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-salary-template-action',
  templateUrl: './salary-template-action.component.html',
  styleUrls: ['./salary-template-action.component.scss']
})
export class SalaryTemplateActionComponent {

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
    if(this.cellValue.status == "Active"){
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
    this.route.navigate(['master/payroll/salary-templates/template-view'], { queryParams: { template_id: this.cellValue.id } })
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

    this.payrollService.updateTemplateStatus_byId(this.cellValue.id, data).subscribe((res:any) =>{
      if(res && res.status){
        this.toaster.success(`The Salary Template is ${sta} successfully.`);
        this.reloadCurrentRoute();
      }
    },err =>{
        this.toaster.error(err.error.message);
        this.reloadCurrentRoute();
    })
  };

  edit(e:any){
    console.log(e,'eeeeeeee');
    this.route.navigate(['master/payroll/salary-templates/create-template'], { queryParams: { template_id: this.cellValue.id } })
    
  }
 
}
