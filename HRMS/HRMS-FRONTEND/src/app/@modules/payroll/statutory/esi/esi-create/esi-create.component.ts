import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-esi-create',
  templateUrl: './esi-create.component.html',
  styleUrls: ['./esi-create.component.scss'],
})
export class EsiCreateComponent {
  esiForm: FormGroup;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  esiId: any;
  esiData: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService
  ) {
    this.esiForm = this.fb.group({
      deduction_cycle: ['monthly', Validators.required],
      employee_contribution: ['0.75', Validators.required],
      employer_contribution: ['3.25', Validators.required],
      employer_contribution_in_ctc: [false],
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.esiId = params.esi_id;

      // Proper check for esiId
      if (this.esiId) {
        this.getEsiById(this.esiId);
      }
    });
  }

  getEsiById(id: any) {
    this.payrollService.getESIbyId(id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.esiData = res.data;
          this.esiForm.patchValue(this.esiData);

          // Disable the form after patching data to make fields readonly
          // this.esiForm.disable();
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  back() {
    window.history.back();
  }

  submitForm() {
    if (this.esiForm.invalid) {
      this.toast.error('Please fill all required fields!');
      this.esiForm.markAllAsTouched(); 
      return;
    }

    let payload = {
      ...this.esiForm.value,
      created_by: this.singInUser.employee_id,
    };

    if (this.esiId) {
      this.updateESI(this.esiId, payload);
    } else {
      this.createESI(payload);
    }
  }

  createESI(payload: any) {
    this.payrollService.createESI(payload).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.toast.success('ESI created successfully!');
          this.route.navigateByUrl('master/payroll/statutory-components/ESI');
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  updateESI(id: any, payload: any) {
    this.payrollService.updateESI(id, payload).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.toast.success('ESI updated successfully!');
          this.route.navigateByUrl('master/payroll/statutory-components/ESI');
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
}
