import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-salary-template-view',
  templateUrl: './salary-template-view.component.html',
  styleUrls: ['./salary-template-view.component.scss']
})
export class SalaryTemplateViewComponent {
  templateId:any;
  templateData:any
  constructor(
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService:PayrollService
  ) {
   
  }

  
  

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.templateId = params.template_id;
    });
    if (this.templateId != undefined || null) {
      this.getSalaryTemplateById(this.templateId)
    }
  }

  
  getSalaryTemplateById(id:any){
    this.payrollService.getSalaryTemplateById(id).subscribe((res:any) => {
      if(res && res.data){
        this.templateData = res.data;
        console.log(this.templateData,'this.templateDatathis.templateDatathis.templateData');
        
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }

  back(){
    window.history.back();
  }
  
}
