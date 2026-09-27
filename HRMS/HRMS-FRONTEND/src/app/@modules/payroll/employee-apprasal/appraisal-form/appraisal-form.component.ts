import { Component,Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss']
})
export class AppraisalFormComponent {
  cell_id: any;
  allData: any;
  checkCond: any;
  remarksForm: any;
  idEmp:any;
  entity_id:any;
  finacial_id: any;
  compList: any;
  selectFlat: boolean = false;
  percentage : boolean = false;
  loading: boolean = false;
  constructor( private payrollService: PayrollService,private  _saleryService:SalaryProcessService, public dialog: MatDialogRef<AppraisalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService,private route: Router,private fb: FormBuilder, private _commonService : CommonService, ) {
    this.cell_id = this.data?.procurement_id;
   console.log(data,'data<<<');
   this.allData=data;
this.checkCond=data.statu;
    this.remarksForm= this.fb.group({
      salarytype: new FormControl('CTC'),
      salary_mode: new FormControl(null,Validators.required),
      select_component:new FormControl(null),
      calculation_percentage:new FormControl(null),
      type:new FormControl(null,Validators.required),
      flat_amount:new FormControl(null),
      remarks:new FormControl(null),
      salary_apply_date:new FormControl(null,Validators.required)



    })

    
  }
  ngOnInit(): void{
    
    this.idEmp=localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)
    this.getAllCreatedAllownceComp();
    if(this.allData?.action)
  this.getByData()

  
  }

  selectsalary(e:any){
    
    console.log(e);
    if(e?.value === "Flat"){
      
      this.selectFlat = true;
      this.percentage = false;

    }else{
      this.percentage = true;
      this.selectFlat = false;

    }
    
  }

  getByData(){
    this.payrollService.getByApprisal(this.allData?.id?.payrollDetails_id).subscribe((res:any)=>{
      console.log(res,'ress');
      this.remarksForm.patchValue({
        salarytype:res.data?.salary_type,
      salary_mode:res.data?.appraisal_mode,
      select_component:res.data?.appraisal_comp_type,
      calculation_percentage:res.data?.calculation_percentage,
      type:res.data?.appraisal_type,
      flat_amount:res.data?.appraisal_amount
      })
      if(res.data?.appraisal_mode === "Flat"){
        this.selectFlat = true;
        this.percentage = false;
      }else{
        this.percentage = true;
         this.selectFlat = false;
      }
    })
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
  submitForm(){
    
    let val=this.remarksForm.value;
    if(this.remarksForm.invalid){
this.toast.error("All Fileds Are Required");
return
    }
    if(this.allData?.action === "Update"){
      let dataUpdate={
        // salary_template_id:this.allData?.dataAppraisal, 
        approval_status: "APPROVED",
        progress_status: "CLOSE",
        employee_id:this.allData?.id?.employee_id,
        final_status: "APPROVED",
        login_id:this.idEmp,
        remarks:val?.remarks
      }
  
      this.payrollService.pendingToBeUpdate(this.allData?.id?.payrollDetails_id,dataUpdate).subscribe((res:any)=>{
      this.toast.success(`${res.message}`)
      this.dialog.close();
  
      },
      ((err:any)=>{
        this.toast.error(`${err?.error?.message}`);
      this.dialog.close();

      })
      )
    }else{
      let dataSend={
        // salary_template_id:this.allData?.dataAppraisal, 
        employee_id:this.allData?.approval_data,
        // last_increment_date:this.allData?.last_increment || null,
        entity_id:this.entity_id,
        financial_year_id:this.finacial_id, 
        salary_type:val?.salarytype,
        appraisal_type:val?.type,
        appraisal_mode:val?.salary_mode, 
        appraisal_comp_type:val?.select_component,
        appraisal_percentage:val?.calculation_percentage, 
        appraisal_amount:val?.flat_amount,
        login_id:this.idEmp,
        salary_apply_date: moment(val?.salary_apply_date).format("YYYY-MM-DD"),
        workflow_type:"Employee Appraisal"
      }
      this.loading = true
      this.payrollService.createEmpApprisal(dataSend).subscribe((res:any)=>{
      this.toast.success(`${res.message}`)
      this.dialog.close();
      this.loading = false;
      window.location.reload();
      },
      ((err:any)=>{
        this.toast.error(`${err?.error?.message}`)
      this.dialog.close();
      this.loading = false;
      })
      )
    }
   
  }

  rejectForm(){
    let val=this.remarksForm.value;

    let dataUpdate={
      // salary_template_id:this.allData?.dataAppraisal, 
      approval_status: "REJECTED",
      progress_status: "CLOSE",
      employee_id:this.allData?.id?.employee_id,
      final_status: "REJECTED",
      remarks:val?.remarks

    }

    this.payrollService.pendingToBeUpdate(this.allData?.id?.payrollDetails_id,dataUpdate).subscribe((res:any)=>{
    this.toast.success(`${res.message}`)
    this.dialog.close();

    },
    ((err:any)=>{
      this.toast.error(`${err?.error?.message}`)
      this.dialog.close();

    })
    )
  }
  closeDialog(): void {
    this.dialog.close();
  }
}
