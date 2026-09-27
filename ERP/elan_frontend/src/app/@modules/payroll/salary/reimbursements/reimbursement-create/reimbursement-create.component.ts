import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-reimbursement-create',
  templateUrl: './reimbursement-create.component.html',
  styleUrls: ['./reimbursement-create.component.scss']
})
export class ReimbursementCreateComponent {
  reimbursementForm:FormGroup
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  riemburcementId: any;
  riemburcementData: any;
  typeCheck: any;
  allownceData:any;
  compList: any;
  calculationFlat: boolean =true;
  calculationPercentage:boolean =false;
  is_taxable:any;
  selectedValueTax:any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService:PayrollService
  ) {
    this.reimbursementForm = this.fb.group({
      // tax_allowance_id: [null, Validators.required],
      reimbursement_type: [null, Validators.required],
      // calculation_percentage:[null],
      // calculation_amount:[null],
      // calculation_type:[null],
      // type:[null],
      is_taxable:[null],
      reimbursement_name:[null]
      // is_fbp_component: [null],
      // unclaimed_reimbursement: ['encash_reimburcement_yearly'],
      // max_limit:[null,Validators.required],
      // is_opt_in:[null]
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.riemburcementId = params.reibursement_id;
      this.typeCheck=params?.type;

    });
    if (this.riemburcementId != undefined || null) {
      this.getReiembursementComponentById(this.riemburcementId)
    }
    this.getAllOtherAllowance();
    this.getAllCreatedAllownceComp();
    this.callData();
  }


  callData(){
    this.reimbursementForm.patchValue({
      is_taxable:'false'
    })
  }

  getReiembursementComponentById(id:any){
    this.payrollService.getReiembursementComponentById(id).subscribe((res:any) => {
      if(res && res.data){
        this.riemburcementData = res.data;
        this.reimbursementForm.patchValue(this.riemburcementData);
      if(res.data?.is_taxable === 1){
        this.reimbursementForm.patchValue({
          is_taxable:"true"
        })
      }else{
        this.reimbursementForm.patchValue({
          is_taxable:"false"
        })

      }
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }

  back(){
    window.history.back();
  }

  submitForm(){
    console.log(this.reimbursementForm.value,'this.reimbursementForm.value');
  const payload = {
      ...this.reimbursementForm.value,
      // created_by:this.singInUser.employee_id,
      // is_taxable:this.is_taxable,
      // created_by:this.earningObj?.created_by,
      // reimbursement_name:this?.earningObj?.allowance_name
  }

  if(this.riemburcementId != undefined || this.riemburcementId != null ){
    this.updateReiembursementComponent(this.riemburcementId,payload)
  }else{
    this.createReiembursementComponent(payload)
  }
}


createReiembursementComponent(payload:any){
    this.payrollService.createReiembursementComponent(payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('Allowances Created successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/reimbursements')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }

  updateReiembursementComponent(id:any,payload:any){
    this.payrollService.updateReiembursementComponent(id,payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('Allowances Updated successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/reimbursements')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }
  earningObj: any;

  getAllOtherAllowance(){
    this.payrollService.getAllOtherAllowance().subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
      this.allownceData=res.data;
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }
  changeAllownce(e:any){
console.log(e,'eeeeeeeeeee');
let value = e?.value;
this.earningObj = this.allownceData?.find((elem: any) => elem?.id == value);
console.log(this.earningObj,'this.earningObj');
this.is_taxable=this.earningObj?.is_taxable;
  }


  onCalculationTypeChange(event: any) {
    const calculationType = event.value;
console.log(event);

    if (calculationType === 'Flat Amount') {
      this.calculationFlat=true;
      this.calculationPercentage=false;

      this.reimbursementForm.get('calculation_percentage')?.clearValidators();
      this.reimbursementForm.get('calculation_percentage')?.setValue(null);
      this.reimbursementForm.get('calculation_percentage')?.updateValueAndValidity();
      this.reimbursementForm.get('calculation_amount')?.setValidators([Validators.required]);
      this.reimbursementForm.get('calculation_amount')?.updateValueAndValidity();
    } else if (calculationType === 'Percentage of') {
      this.calculationPercentage=true;
      this.calculationFlat=false;

      this.reimbursementForm.get('calculation_amount')?.clearValidators();
      this.reimbursementForm.get('calculation_amount')?.setValue(null);
      this.reimbursementForm.get('calculation_amount')?.updateValueAndValidity();

      this.reimbursementForm.get('calculation_percentage')?.setValidators([Validators.required, Validators.max(99), Validators.min(0)]);
      this.reimbursementForm.get('calculation_percentage')?.updateValueAndValidity();
    } else {
      this.reimbursementForm.get('calculation_percentage')?.clearValidators();
      this.reimbursementForm.get('calculation_percentage')?.setValue(null);
      this.reimbursementForm.get('calculation_amount')?.clearValidators();
      this.reimbursementForm.get('calculation_amount')?.setValue(null);
    }
  }

  getAllCreatedAllownceComp() {
    this.payrollService.getAll_percentageList().subscribe((res: any) => {
      if (res && res.data) {
        this.compList = res.data;
        console.log(this.compList,'this.compList<<<<<<<<<');
        
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  selectionChange(e:any){
console.log(e,'eeeee');

  }

  onSelectionChange(event: any): void {
    const selectedValue = event.value;
      console.log('Selected value in onSelectionChange:', selectedValue);
  
      if(selectedValue == 'true'){
        this.selectedValueTax=true;
      }else{
        this.selectedValueTax=false;
  
      }
    }
}
