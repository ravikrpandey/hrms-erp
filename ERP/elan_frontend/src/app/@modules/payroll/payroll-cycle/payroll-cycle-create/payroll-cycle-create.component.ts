import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-payroll-cycle-create',
  templateUrl: './payroll-cycle-create.component.html',
  styleUrls: ['./payroll-cycle-create.component.scss']
})
export class PayrollCycleCreateComponent {
  payrollCycleForm: FormGroup;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  dates = this.now.getDate();
  maxDate = moment({ year: this.year + 100,month: this.month,date: this.dates,}).format('YYYY-MM-DD');
  minDate = moment({year: this.year - 0, month: this.month, date: this.dates,}).format('YYYY-MM-DD');
  entityList:any =[];
  payroll_cycle_id:any;
  payrollCycleData:any;
  entitYId:any;
  branchList: any;


  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService:PayrollService
  ) {
    this.payrollCycleForm = this.fb.group({
      // payroll_cycle_entity: ['', Validators.required],
      from_payroll_Cycle_date:['', Validators.required],
      to_payroll_Cycle_date:['', Validators.required],
      // payroll_cycle_branch:['',Validators.required]

    });
  }

  ngOnInit(){
    this.entitYId=localStorage.getItem('selectedEntityId')
    this.getAllEntityMasterData();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.payroll_cycle_id = params.payroll_cycle_id;
    });
    if (this.payroll_cycle_id != undefined || null) {
      this.getPayrollCycleDataById(this.payroll_cycle_id)
    }

    this.getAllBranchList()
  }

  getAllBranchList() {
    this.payrollService.getAllBranch().subscribe((res: any) => {
      if (res && res.data) {
        this.branchList = res.data;
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  getPayrollCycleDataById(id:any){
    this.payrollService.getPayrollCycleById(id).subscribe((res:any) => {
      if(res && res.data){
        this.payrollCycleData = res.data;
        this.payrollCycleForm.patchValue({
          from_payroll_Cycle_date:this.payrollCycleData?.start_date,
to_payroll_Cycle_date:this.payrollCycleData?.end_date,
payroll_cycle_branch:this.payrollCycleData?.payroll_cycle_branch
        })
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }

  back(){
    window.history.back();
  }

  getAllEntityMasterData(){
    this.payrollService.getAllEntityMaster().subscribe((res:any) => {
      if(res && res.data){
        this.entityList = res.data;
      }
    },err => {
      this.toast.error(err.error.message)
    })
  }

  submitForm(){
    // if(this.payrollCycleForm.valid){
      let data  = this.payrollCycleForm.value;
      let entity = this.entityList.find((res:any) => res.id == this.entitYId)
      let payload = {
        ...data,
        created_by:this.singInUser.employee_id,
        entity_name:entity.entity_name
      }

      console.log(payload,"llllllll");
      this.createPayrollCycle(payload);
      
    // }
    // else{
    //   this.toast.error('Please fill all the required field.')
    // }
  }

    createPayrollCycle(payload:any){
      this.payrollService.createPayrollCycle(payload).subscribe((res:any) => {
        if(res && res.data){
          console.log(res.data);
          this.toast.success('New payroll cycle created successfully.');
          this.route.navigateByUrl('master/payroll/payroll-cycle')
        }
      }, err=>{
        this.toast.error(err.error.message);
      })
    }
  
}
