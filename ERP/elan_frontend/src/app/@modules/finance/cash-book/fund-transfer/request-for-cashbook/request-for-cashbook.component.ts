import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value?.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-request-for-cashbook',
  templateUrl: './request-for-cashbook.component.html',
  styleUrls: ['./request-for-cashbook.component.scss']
})

export class RequestForCashbookComponent implements OnInit {
  requestCashBookform: FormGroup;
  remarksFormGroup:FormGroup;
  entity_id:any;
  loginUser: any;
  imageToUpload: any;
  imagePath: any;
  fileUpload: any;
  department_id: any;
  FundRequestNo: any;
  fundTransferCode:string = '';
  employee_id:any;
  financial_id: any;
  constructor(
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private toaster: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private $common: CommonService,
    private recruitService: RecruitService,
  ) {
    this.requestCashBookform = this.fb.group({
      request_date: new FormControl('', [Validators.required]),
      amount_for_request: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      department_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      department_id: new FormControl(null),
      expense_type: new FormControl(null, [Validators.required]),
      require_by: new FormControl(null, [Validators.required]),
      reason: new FormControl('',[noLeadingSpaces()]),
      remark: new FormControl('',[noLeadingSpaces()]),
      file:  new FormControl(''),

      fund_request_no: new FormControl('')
    });

    this.remarksFormGroup = this.fb.group({
      remarks_for_approval:['']
    });
    this.fundTransferCode = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
  }

  view:any;
  edit:any;
  getUserRole:any;


  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.department_id = localStorage.getItem('department_id')
    this.employee_id = localStorage.getItem('EmpMainId');
    const signInUserData = localStorage.getItem('signInUser');
    this.financial_id = localStorage.getItem("financial_id");

    // this.activeRoute.queryParams.subscribe((res: any) => {
      if (signInUserData) {
        const signInUserObject = JSON.parse(signInUserData);
        this.getUserRole = signInUserObject.role;
      } else {
        console.log('Value for signInUser not found in localStorage');
      }
    // })
    this.getDepartNameById();
    this.generateFundRequestNo();
    let fundTransferId ;
    this.activeRoute.queryParams.subscribe((res: any) => {
      fundTransferId = res.id;
      this.view = res.view;
      this.edit = res.edit;
      if (this.view) {
        this.requestCashBookform.disable();
      } else {
        this.requestCashBookform.enable();
      }
      // this.quotation_id = parseInt(res.quotation_id);
    });

    if (fundTransferId) {
      this.viewFundTransfer(fundTransferId);
    }






  }

  fund_transfer_id:any;
  level:any;
  isView:boolean = false;
  fund_transfer_amount:number = 0;

  viewFundTransfer(id:any)
{
this._finaceservice.getFundTransferById(id,this.employee_id).subscribe((res:any)=>{
  let data = res.data?.query[0];
  this.fund_transfer_id = data?.id;
  this.level = res.data?.level;
  this.fund_transfer_amount = data?.amount_for_request;
  this.fundTransferCode = data?.fund_request_no;
  this.requestCashBookform.patchValue({
    request_date: data.request_date,
    amount_for_request: data.amount_for_request,
    department_name: data.department_name,
    expense_type: data.expense_type,
    require_by: data.require_by,
    reason: data.reason,
    remark: data.remark 
  })
  this.isView=true;
})
}

  closeIcon:boolean =false;
  clear(e:any){
this.closeIcon=false;
this.requestCashBookform.get('expense_type')?.patchValue(null)
  }
  selectedOption(e:any){
    this.closeIcon=true;
  }
  generateFundRequestNo(){
    // this._finaceservice.generateFundRequestNo().subscribe((res:any)=>{
    //   this.FundRequestNo = res.data;
    //   this.requestCashBookform.get('fund_request_no')?.setValue(this.FundRequestNo);
    // });

      this.requestCashBookform.get('fund_request_no')?.setValue(this.fundTransferCode);
  }

  generateImageUrl() {
    return environment.servralUrl + '/' + "uploaded_files" + '/'
  }

  getDepartNameById(){
    // this._finaceservice.getDepartNameById(this.department_id).subscribe((res: any) => {
    // });
      let department_name = 'Finance';
      this.requestCashBookform.get('department_name')?.setValue(department_name);
      this.requestCashBookform.get('department_id')?.setValue(110);
    
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type.split('/').pop().toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false,true,false);
    if (!isValidExtension) return this.requestCashBookform.value.file.setValue(null)
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = uploadedFileType == 'pdf' ? "/assets/icons/pdfimg.png" : e.target.result
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    let formData = new FormData();

    formData.append('file', this.imageToUpload);

    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      this.fileUpload = res?.url;
      this.requestCashBookform.patchValue({
        uploade_file:this.fileUpload
      });
    })
  }

  onSubmit() {
    if(this.requestCashBookform.invalid){
      Object.values(this.requestCashBookform.controls).forEach(control => {
        control.markAsTouched();
      });
      return
    }
    let data = {
      entity_id:this.entity_id,
      requestCashBookform: this.requestCashBookform?.value,
      employee_id: this.employee_id
    }




    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
      next: (res: any) => {
  
  
      
        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
  
  if(isExistData){
    this._finaceservice.requestCashbookRequest(data).subscribe((response: any) => {
      if (response) {
        this.toaster.success(response.message);
        this.router.navigate(['master/finance/cash-books/fund_transfer'])
      }
    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }else{
    if (!isExistData && res.code===200) {
      this.toaster.warning(res.message);
      return
    }
    if (!isExistData && res.code===201) {
      this.toaster.warning(res.message);
      return
    }
  
  }
      }, error: (err) => {
  
        if (err.error.code === 404) {
          this.toaster.warning(
            err.error.message
          );
        }
  
      },
    })
  









    
  }

  goBack(){
    this.router.navigate(['master/finance/cash-books/fund_transfer'])
  }



  rejected(){


    Swal.fire({
      title: 'Are you sure you want to reject?',

      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Reject !',
      cancelButtonText: 'Skip',
    }).then((result:any) => {

        if (result.value) {
          let empid = localStorage.getItem('EmpMainId');
          let formdata:any ={
          progress_status:'CLOSE',
          emp_id:empid,
          approval_status:"REJECTED",
          role: this.getUserRole,
          amount: this.fund_transfer_amount,
          entity_id:this.entity_id
        }
      
          this._finaceservice.approvedFundTransferById(this.fund_transfer_id,formdata).subscribe((res: any) => {
            console.log(res, "Updated Status");
            this.toaster.success('Status updated sucessfully');
            this.router.navigate(['master/finance/cash-books/fund_transfer'])
            // this.reloadCurrentRoute();
            

           },(error:any)=>{
            console.log('Error updating status:', error);
            // this.reloadCurrentRoute();
              this.toaster.error('Failed to update status');

            this.router.navigate(['master/finance/cash-books/fund_transfer'])
           });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }
  approved(){
    Swal.fire({
      title: 'Are you sure you want to approve ?',

      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Approved !',
      cancelButtonText: 'Skip',
    }).then((result:any) => {
      if (result.value) {
        let empid = localStorage.getItem('EmpMainId');
        let formdata:any ={
        progress_status:'CLOSE',
        emp_id:empid,
        approval_status:"APPROVED",
        role: this.getUserRole,
        amount: this.fund_transfer_amount,
        entity_id: this.entity_id
      }
    
        this._finaceservice.approvedFundTransferById(this.fund_transfer_id,formdata).subscribe((res: any) => {
          console.log(res, "Updated Status");
          this.toaster.success('Status updated sucessfully');
          this.router.navigate(['master/finance/cash-books/fund_transfer'])
          // this.reloadCurrentRoute();
          

         },(error:any)=>{
          console.log('Error updating status:', error);
          // this.reloadCurrentRoute();
            this.toaster.error('Failed to update status');

          this.router.navigate(['master/finance/cash-books/fund_transfer'])
         });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    // console.log(this.remarksForm.value);

  }

  reloadCurrentRoute() {

    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });


  }

}
