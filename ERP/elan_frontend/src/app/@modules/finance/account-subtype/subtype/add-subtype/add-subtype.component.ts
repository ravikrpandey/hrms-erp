import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-add-subtype',
  templateUrl: './add-subtype.component.html',
  styleUrls: ['./add-subtype.component.scss']
})
export class AddSubtypeComponent implements OnInit {
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
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      account_type_id: new FormControl('', [Validators.required]),
      account_subtype_name: new FormControl('', [Validators.required,noLeadingSpaces()]),
      subtype_code: new FormControl('', [Validators.required,noLeadingSpaces()]),
      subtype_description: new FormControl('', [Validators.required,noLeadingSpaces()]),
    });
  }
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
    this.location.back();
  }
  onSubmit(data: any) {
    // data.roleFiled.forEach((role: any, index: any) => {
    //   role['level'] = index + 1;
    // });

    if (this.subtypeId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }
      this._finaceservice.updateAccountSubtype(this.subtypeId, data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['master/finance/account-subtype/list-acc-subtypes'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.subtypeId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.toaster.error('All fields are Mendatory', 'Error Message')
        return
      }
      this._finaceservice.createAccountSubtype(data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          // this.form.reset();
          this.router.navigate(['master/finance/account-subtype/list-acc-subtypes'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }

  }
  getAllAccountTypeList() {
    this._finaceservice.getAllAccountTypeList().subscribe((res: any) => {
      this.getAccount_data = res.data.filter((res: any) => res.status == "ACTIVE");
      if(!this.subtypeId){
        this.form.patchValue({subtype_code: res?.AST_code});
      }
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

