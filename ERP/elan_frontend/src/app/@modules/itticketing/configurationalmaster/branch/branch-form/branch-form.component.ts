import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss'],
})
export class BranchFormComponent implements OnInit {
  form: FormGroup;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  mode: 'add' | 'view' | 'edit' = 'add';
  id: number;

  constructor(
    private fb: FormBuilder,
    private config: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      branch_name: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
      country_id: [null, Validators.required],
      state_id: [null, Validators.required],
      city_id: [null, Validators.required],
      branch_pin_code: [null, Validators.required],
      branch_address: [null, Validators.required],
    });

    this.getCountry();
    this.form.get('country_id')?.valueChanges.subscribe((res: any) => {
      this.getState(res);
    });

    this.form.get('state_id')?.valueChanges.subscribe((res: any) => {
      this.getCity(res);
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params['id']) {
        this.id = params.id;
        this.mode = params.mode;
        if (this.mode === 'view') {
          this.form.disable();
        } else {
          this.form.enable();
        }
        this.getBranchById();
      } else {
        this.mode = 'add';
        this.form.enable();
      }
    });
  }

  getBranchById() {
    this.config.branchSetupGetById(this.id).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  getCountry() {
    this.config.getAllActivecountry().subscribe((res: any) => {
      this.countryList = res.data;
    });
  }

  getState(country_id: any) {
    this._empRegistration
      .getStateByCountry(country_id)
      .subscribe((res: any) => {
        this.stateList = res.data;
      });
  }

  getCity(state_id: any) {
    this._empRegistration.getCityByState(state_id).subscribe((res: any) => {
      this.cityList = res.data;
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.error('Please Fill All The Fields!', 'Error Message');
      return;
    }
    if (this.mode === 'edit') {
      this.config.updateBranchSetup(this.id, this.form.value).subscribe(
        (res: any) => {
          this.toast.success('Branch Updated Successfully!');
          this.router.navigateByUrl('/master/configurational-master/branch');
        },
        (err: any) => {
          this.toast.error('branch_name is All Ready Exits!', 'Error Message');
        },
      );
      return;
    }
    this.config.branchSetupCreate(this.form.value).subscribe(
      (res: any) => {
        this.toast.success('Branch Created Successfully!');
        this.router.navigateByUrl('/master/configurational-master/branch');
      },
      (err: any) => {
        this.toast.error('branch_name is All Ready Exits!', 'Error Message');
      },
    );
  }
}
