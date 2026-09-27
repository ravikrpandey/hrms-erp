import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-payment-program-dialog',
  templateUrl: './payment-program-dialog.component.html',
  styleUrls: ['./payment-program-dialog.component.scss']
})
export class PaymentProgramDialogComponent {
 form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  subtypeId: any;
  employeeDetails: any = [];
  loginUser: any;
  item_masterData: any;
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []

  constructor(private location: Location,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private matdialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      
      invoice_number: new FormControl(''),
      amount: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }
  total_invoice_amt:any
  ngOnInit(): void {
    this.getAllAccountTypeList()
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.subtypeId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.subtypeId) {
      this.getAccountSubtypeById();
    }
    console.log(this.data,'ddd')
    this.total_invoice_amt = this.data.reduce((acc:any,res:any)=>{
      return acc + parseFloat(res.amount_due) || 0
    },0)
this._finaceservice.paymentProgramCode().subscribe((res:any)=>{
  this.form.patchValue({
    invoice_number:res.data
  })
})

  }
  // createItemFormGroup() {
  //   return this.fb.group({
  //     roleId:new FormControl('',[Validators.required]),
  //     employeeId:new FormControl('',[Validators.required]),
  //   });
  // }
  // get itemsFormArray(): any {
  //   return this.form.get('roleFiled') as FormArray;
  // }

  get CF_3(): any {
    return this.form.controls;
  }
  goBack() {
      this.matdialog.closeAll()
  }
  onSubmit(data: any) {
   
    let payload={
      ...data,
      dataList:this.data
    }

      this._finaceservice.paymentProgram(payload).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.matdialog.closeAll()
          this.router.navigate(['/master/finance/payment-program'])
          this.reloadCurrentRoute()
        }
      }, (err: any) => {
        this.toaster.error(err.error.message);
      })
 
 
  }


 reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  getAllAccountTypeList() {
    let entity_id = localStorage.getItem("selectedEntityId");

    this._finaceservice.getBank(entity_id).subscribe((res: any) => {
      this.getAccount_data = res.data.filter((res: any) => res.status == "ACTIVE");
      if(!this.subtypeId){
        this.form.patchValue({subtype_code: res?.AST_code});
      }
    })
  }
  getAccountListData:any=[]
getAccountList(data:any){
  this._finaceservice.getBankAccountById(data.id).subscribe((res:any)=>{
   this.getAccountListData = res.data;
  })
}


  getAccountSubtypeById() {
    this._finaceservice.getAccountSubtypeById(this.subtypeId).subscribe((response: any) => {
      // setTimeout(() => {
        this.form.patchValue({
          account_type_id: response.data[0]?.account_type_id,
          account_subtype_name: response.data[0]?.account_subtype_name,
          subtype_code: response.data[0]?.subtype_code,
          subtype_description: response.data[0]?.subtype_description,
        })
      // }, 100);
      // console.log(this.employeeDetails, 'this.employeeDetails');
      // this.employeeDetails.forEach((item: any, index: number) => {
      //   console.log(item, 'itemmm');

      //   const formGroup = this.itemsFormArray.at(index) as FormGroup;
      //   console.log(formGroup, 'formgroup');
      //   this._rbacMasterService.employeGetByroleId(item.role_master_id).subscribe((res: any) => {
      //     console.log(res, 'resdata');
      //     this.roleGetByemployee[index] = res.data;



      //   });
      //   if (formGroup) {
      //     setTimeout(() => {
      //       // this.roleIdData(item.role_master_id, index)
      //       formGroup.patchValue({
      //         roleId: item.role_master_id,
      //         employeeId: item.employee_id,

      //       });

      //     }, 200)
      //     this.cdr.detectChanges();
      //   }
      //   else {
      //     this.itemsFormArray.push(
      //       this.fb.group({
      //         roleId: item.role_master_id,
      //         employeeId: item.employee_id,
      //       })
      //     );
      //   }
      // });

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };
}
