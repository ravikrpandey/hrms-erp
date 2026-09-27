import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { SalesTargetService } from 'src/app/@shared/services/sales-target.service';

@Component({
  selector: 'app-create-target',
  templateUrl: './create-target.component.html',
  styleUrls: ['./create-target.component.scss']
})
export class CreateTargetComponent {

  actions: {
    label: string;
    icon?: string;
    callback: () => void;
    color?: string;
  }[] = [];

  formData: FormGroup;
  entity_id: any;
  financial_year_id: any;
  login_id: any;
  user_role_code: any;
  reportingManagerList: any[] = [];
  employeeList: any[] = [];
  target_id: any;
  isViewMode: boolean = false;
  actionStatus: string = 'PENDING';

  constructor(
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private STService: SalesTargetService,
    private accessCtrl: AccessControlService, private cryptoService: CryptoService
  ) {
    this.formData = this.fb.group({
      id: [null],
      target_name: new FormControl(null, Validators.required),
      valid_from: new FormControl(null, Validators.required),
      valid_to: new FormControl(null, Validators.required),
      target_amount: new FormControl(null, [Validators.required,Validators.min(1)]),
      reporting_manager_id: new FormControl(null, Validators.required),
      employee_ids: new FormControl([], Validators.required),
      employee_targets: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.entity_id= this.accessCtrl.getEntityId();
    this.financial_year_id= this.accessCtrl.getFinancialId();
    this.user_role_code= this.accessCtrl.getRoleCode();
    this.login_id= this.accessCtrl.getEmployeeId();
    this.activeRoute.queryParams.subscribe({
      next: (res: any) => {
        if (this.cryptoService.decrypt(res?.mode) == 'view') {
          this.isViewMode = true;
          this.formData.disable();
        }
        this.target_id = this.cryptoService.decrypt(res?.id);
        if(this.target_id){
          this.getDataById(this.target_id);
        }
      }, error: (err) => {
        console.log('error==>', err)
      },
    })
    
    this.getReportingManagerList();

    this.formData.get('reporting_manager_id')?.valueChanges.subscribe((res: any) => {
      this.employeeTargets.clear();
      this.getEmployeeList(res);
    });

    this.formData.get('employee_ids')?.valueChanges.subscribe((ids: any[]) => {
      this.createEmployeeTargets(ids);
    });

    this.formData.get('target_amount')?.valueChanges.subscribe((amount: any) => {
      this.distributeAmount(amount);
    });
  }

  getReportingManagerList() {
    this.STService.getAllReportingManager(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        // SUPER ADMIN => ALL LIST
        if (this.user_role_code === 'Super Admin') {
          this.reportingManagerList = res.data;
        } else {
          // NON SUPER ADMIN => ONLY LOGIN USER
          this.reportingManagerList = res.data.filter(
            (item: any) => item.employee_id == this.login_id
          );
        }
      }
    }, (err: any) => {
      console.log(err);
    })
  }

  getEmployeeList(id: any) {
    this.STService.getAllSalesEmployee(id).subscribe((res: any) => {
      if (res && res.data) {
        this.employeeList = res?.data;
      }
    }, (err: any) => {
      console.log(err);
    })
  }

  get employeeTargets(): FormArray {
    return this.formData.get('employee_targets') as FormArray;
  }

  createEmployeeTargets(ids: any[]) {

    this.employeeTargets.clear();

    const totalAmount = Number(this.formData.value.target_amount || 0);

    const perAmount = ids.length
      ? Number((totalAmount / ids.length).toFixed(2))
      : 0;

    ids.forEach((id: any) => {

      const emp = this.employeeList.find((x: any) => x.employee_id == id);

      this.employeeTargets.push(
        this.fb.group({
          employee_id: [
            id,
            Validators.required
          ],

          employee_name: [
            emp?.employee_name || ''
          ],

          target_amount: [
            perAmount,
            [
              Validators.required,
              Validators.min(1)
            ]
          ]
        })
      );

    });

  }

  distributeAmount(amount: number) {

    const controls = this.employeeTargets.controls;

    if (!controls.length) return;

    const perAmount = Number(
      (amount / controls.length).toFixed(2)
    );

    controls.forEach((control: any) => {

      control.get('target_amount')?.setValue(
        perAmount,
        { emitEvent: false }
      );

    });

  }

  updateMainTargetAmount() {

    let total = 0;

    this.employeeTargets.controls.forEach((control: any) => {

      total += Number(control.value.target_amount || 0);

    });

    this.formData.get('target_amount')
      ?.setValue(total, { emitEvent: false });

  }

  onSubmit() {
    if (this.formData.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }

    const formValue = this.formData.value;
    const payload = {
      id: formValue.id || null,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      target_name: formValue.target_name,
      valid_from: formValue.valid_from,
      valid_to: formValue.valid_to,
      target_amount: Number(formValue.target_amount || 0),
      reporting_manager_id: formValue.reporting_manager_id,
      employee_targets: (formValue.employee_targets || []).map((item: any) => ({
        employee_id: item.employee_id,
        target_amount: Number(item.target_amount || 0)
      }))
    };

    this.STService.createUpdateTarget(payload).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate(['master/sales-target-achievement/sales-target'],
        {
          queryParams: {
            tab: this.cryptoService.encrypt(1)
          }
        })
      }
    }, (err: any) => {
      this.toast.error(err.error.message);
    })
  }

  getDataById(id: any) {
    this.STService.getTargetDetails(id).subscribe((res: any) => {
      let getData = res.data;
      this.actionStatus = res.data.status;
      console.log(res.data)
      // employee ids for dropdown
      const employeeIds = getData?.SALES_TARGET_MAPPINGs?.map(
        (x: any) => x.sales_employee_id
      ) || [];

      this.formData.patchValue({
        id: getData?.id,
        target_name: getData?.target_name,
        valid_from: getData?.valid_from,
        valid_to: getData?.valid_to,
        target_amount: getData?.target_amount,
        reporting_manager_id: getData?.reporting_manager_id,
        employee_ids: employeeIds
      });

      // clear old formarray
      this.employeeTargets.clear();

      // patch employee targets
      if (getData?.SALES_TARGET_MAPPINGs?.length) {
        getData.SALES_TARGET_MAPPINGs.forEach((item: any) => {
          this.employeeTargets.push(
            this.fb.group({
              id: [item.id],
              employee_id: [item.sales_employee_id],
              employee_name: [item?.salesUser?.employee_name || ''],
              target_amount: [item.target_amount]
            })
          );
        });
      }
      if (this.isViewMode) {
        this.employeeTargets.controls.forEach((control: any) => {
          control.get('employee_id')?.disable();
          control.get('employee_name')?.disable();
          control.get('target_amount')?.disable();
        });
      }
    })
  }

}