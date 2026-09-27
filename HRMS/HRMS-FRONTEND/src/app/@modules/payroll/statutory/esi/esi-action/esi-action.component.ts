import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-esi-action',
  templateUrl: './esi-action.component.html',
  styleUrls: ['./esi-action.component.scss']
})
export class EsiActionComponent {

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
      this.route.navigate(['master/payroll/statutory-components/ESI/esi-create'], { queryParams: { esi_id: this.cellValue.id } })
    }
  
    toggle(event:any){
      const val = event.checked ? 'Active' : 'Inactive'
      const sta = event.checked ? "Activated" :"In_Activated"
  
      let data = { 
        status:val
      }
  
      this.payrollService.updateESIStatus(this.cellValue.id, data).subscribe((res:any) =>{
        if(res && res.status){
          this.toaster.success(`The ESI is ${sta} successfully.`);
          this.reloadCurrentRoute();
        }
      },err =>{
          this.toaster.error(err.error.message);
          this.reloadCurrentRoute();
      })
    };
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    };
  

}
