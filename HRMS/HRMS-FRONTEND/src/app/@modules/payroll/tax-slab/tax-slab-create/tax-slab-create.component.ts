import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { Location } from '@angular/common';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-tax-slab-create',
  templateUrl: './tax-slab-create.component.html',
  styleUrls: ['./tax-slab-create.component.scss']
})
export class TaxSlabCreateComponent {

  createComplaint: FormGroup;
  complaintId: any;
  id: any;
  mainId: any;
  allComplaint: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  personalIdData: any;
  nameAchieve: any;
  reportingManagerList: any = [];
  loginUser: any;
  createTaxslab: any;
  arrayDataTaxSlab: any[] = [];
  isEditing = false;
  editIndex = null;
  Type: any = null;
  constructor(
    private emp_master: EmpMasterService,
   
    private payrollService:PayrollService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location
  ) {
    this.createComplaint = this.fb.group({
      id: new FormControl(null),
      
      min: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
      percentage: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      addmin: [false],
      addmax: [false],
      tax_name:new FormControl(null),
      standard_deduct:new FormControl(null)
      
      
    
    });
  
  }
  
  ngOnInit(): void {
    
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.Type = params['Type'];  

      if (this.id) {

        this.getTaxslabbyId(this.id);
      }
    });
  }
  
  goBack() {
    this.location.back();
  }
 
  getTaxslabbyId(id: any): void {
    this.payrollService.getTaxslabbyId(id).subscribe((res:any) => {
 
      let val = res.data; 
      let minValue = val.min === 'Upto' ? true : false;  
      let maxValue = val.max === 'Upto' ? true : false;     
      this.createComplaint.patchValue({
        min: val.min === 'Upto' ? 'Upto' : val.min,
        max: val.max === 'Upto' ? 'Upto' : val.max, 
        addmin: minValue,
        addmax: maxValue,
        percentage: val.percentage,
        start_date: moment(val.start_date, "DD-MM-YYYY").toDate(),
        tax_name:res.data?.tax_slab_name

      });
      this.createComplaint.patchValue(({
        standard_deduct:res.data?.standard_deduction
      }))
      this.arrayDataTaxSlab=res.data?.tax_slab_row
    });
  }

  
      


  onSubmitForm(e: any) {
    Object.keys(this.createComplaint).forEach(controlName => {
      const control = this.createComplaint.get(controlName);
      control?.markAsTouched();
    });  
    if ( !this.isEditing) {
      let val = this.createComplaint.value;
      
      // let dataModify = {
      //   question: val.question_name,
      //   answer: val.question_answer
      // }
      debugger;
      if ( !this.createComplaint.controls['addmin'].value && !this.createComplaint.controls['addmax'].value) {
        if ( Number(val.min) > Number(val.max)) {
          this.toast.error('Minimum value should be less than Maximum value');
          return;
        }
      }
      if (Number(val.percentage) > 100 || Number(val.percentage) < 0) {
        this.toast.error('Percentage should be between 0 to 100');
        return;
      }
      let minValue = val.min === 'Upto' || this.createComplaint.controls['addmin'].value ? 'Upto' : val.min;
      let maxValue = val.max === 'Upto' || this.createComplaint.controls['addmax'].value ? 'Upto' : val.max;
    
      let index = this.arrayDataTaxSlab.length + 1; ;  // Initialize serial number (starting from 1)

      const data = {
        serialNumber: index,  // Add the serial number
        min: minValue,
        max: maxValue,
        percentage: Number(val.percentage) || 'NIL',
        // start_date: moment(val.start_date).format("DD-MM-YYYY")
      };
     
      this.arrayDataTaxSlab.push(data);  // Push the data with serial number
      
      index++; 
      console.log(this.arrayDataTaxSlab);
      this.createComplaint.get('min')?.reset();
      this.createComplaint.get('max')?.reset();
      this.createComplaint.get('percentage')?.reset();
      this.createComplaint.get('min')?.markAsPristine();
      this.createComplaint.get('max')?.markAsPristine();
      this.createComplaint.get('percentage')?.markAsPristine();
      this.createComplaint.get('min')?.markAsUntouched();
      this.createComplaint.get('max')?.markAsUntouched();
      this.createComplaint.get('percentage')?.markAsUntouched();
    }
    else {
      let val = this.createComplaint.value;

      console.log(val,'valllll');
      
      // let dataModify = {
      //   question: val.question_name,
      //   answer: val.question_answer
      // }
      let minValue = val.min === 'Upto' || this.createComplaint.controls['addmin'].value ? 'Upto' : val.min;
      let maxValue = val.max === 'Upto' || this.createComplaint.controls['addmax'].value ? 'Upto' : val.max;
    
      let index = this.arrayDataTaxSlab.length + 1; ;  // Initialize serial number (starting from 1)

      const data = {
        serialNumber: this.editIndex,  // Add the serial number
        min: minValue,
        max: maxValue,
        percentage: Number(val.percentage) || 'NIL',
        // start_date: moment(val.start_date).format("DD-MM-YYYY")
      };
      if ( this.editIndex !== null) {
        this.arrayDataTaxSlab[this.editIndex] = data;  // Push the data with serial number
      }
      
      this.createComplaint.get('min')?.reset();
      this.createComplaint.get('max')?.reset();
      this.createComplaint.get('percentage')?.reset();
      this.createComplaint.get('min')?.markAsPristine();
      this.createComplaint.get('max')?.markAsPristine();
      this.createComplaint.get('percentage')?.markAsPristine();
      this.createComplaint.get('min')?.markAsUntouched();
      this.createComplaint.get('max')?.markAsUntouched();
      this.createComplaint.get('percentage')?.markAsUntouched();
      this.isEditing = false;
      this.editIndex = null;
    }


  
 
    // if (this.id) {
  
    //   this.payrollService.updateTaxslab(this.id, data).subscribe(
    //     (res: any) => {
    //       this.toast.success(res.message);
    //       this.router.navigate(['/master/payroll/tax-slab']);
    //     },
    //     (err) => {
    //       if (err.status == 400) {
    //         this.toast.error('Something went wrong!');
    //       } else {
    //         this.toast.error('Error in submission!');
    //       }
    //     }
    //   );
    // } else {

    //   this.payrollService.createTaxslab(data).subscribe(
    //     (res: any) => {
    //       this.toast.success(res.message);
    //       this.router.navigate(['/master/payroll/tax-slab']);
    //     },
    //     (err) => {
    //       if (err.status == 400) {
    //         this.toast.error('Something went wrong!');
    //       } else {
    //         this.toast.error('Error in submission!');
    //       }
    //     }
    //   );
    // }
  }
  
  onSubmitFormFinal(e:any){
    let val = this.createComplaint.value;
    
    const data = {
      tax_slab_name:val?.tax_name,
      start_date:moment(val.start_date).format("DD-MM-YYYY"),
      tax_slab_row:this.arrayDataTaxSlab,
      standard_deduction:val?.standard_deduct
    };
    if (this.id) {
  
      this.payrollService.updateTaxslab(this.id, data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['/master/payroll/tax-slab']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    } else {

      this.payrollService.createTaxslab(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['/master/payroll/tax-slab']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
  }
   
  // updateForm(e: any) {
  //   e.stopPropagation();
  //   this.payrollService
  //     .updateTaxslab(this.id, this.createComplaint.value)
  //     .subscribe((res: any) => {
  //       this.toast.success('Complaint Details Updated successfully..');
  //       this.route.navigate(['master/ess/complaint-list']);
  //     });
  // }
  // onUpdateForm() {
  //   let val = this.createComplaint.value;

  //   const data = {
     
  //   };
  // }

  

  reLoad() {
    // window.location.reload();
    history.back();
  }

  edit(data:any,i:any) {
    this.isEditing = true;
    this.editIndex = i;
    this.createComplaint.patchValue({
      min: data.min,
      max: data.max,
      percentage: data.percentage,
    });
  }

  deleteRow(data:any,i:any) {
    this.arrayDataTaxSlab.splice(i, 1);
  }

}
