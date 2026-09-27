import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';


@Component({
  selector: 'app-view-subtype',
  templateUrl: './view-subtype.component.html',
  styleUrls: ['./view-subtype.component.scss']
})
export class ViewSubtypeComponent implements OnInit {
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
      account_subtype_name: new FormControl('', [Validators.required]),
      subtype_code: new FormControl('', [Validators.required]),
      subtype_description: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.subtypeId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.subtypeId) {
      this.getAccountSubtypeById();
    }
  }

  getAccountSubtypeById() {
    this._finaceservice.getAccountSubtypeById(this.subtypeId).subscribe((response: any) => {
        this.form.patchValue({
          account_type_id: response.data[0]?.account_type_name,
          account_subtype_name: response.data[0]?.account_subtype_name,
          subtype_code: response.data[0]?.subtype_code,
          subtype_description: response.data[0]?.subtype_description,
        })
    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }
}