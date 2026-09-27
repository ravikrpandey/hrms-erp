import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ThirdPartyService } from '../../../services/third-party.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-org-setup-form-dialog',
  templateUrl: './org-setup-form-dialog.component.html',
  styleUrls: ['./org-setup-form-dialog.component.scss'],
})
export class OrgSetupFormDialogComponent implements OnInit {
  form: FormGroup;
  userForm: FormGroup;
  typeList: any = [];
  roles: any = [];
  entities: any[] = [];

  constructor(
    private dialog: MatDialogRef<OrgSetupFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: ThirdPartyService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private entityService: EntityMasterService,
    private accssCtrl: AccessControlService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gst: [''],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      orgTypeId: ['', Validators.required],
      status: [true],
    });
    this.userForm = this.fb.group({
      employee_id: [null],
      first_name: ['', Validators.required],
      last_name: [''],
      middle_name: ['3PL_ADMIN'],
      employee_official_email: ['', [Validators.required, Validators.email]],
      contry_code: ['+91'],
      contact_number: ['', Validators.required],
      role_master_id: ['', Validators.required],
      primary_entity_id: [this.accssCtrl.getEntityId(), Validators.required],
      serverUrl: window.location.origin,
    });
    if (data && this.data.type === 'edit') {
      this.form.patchValue(data.data);
      if (data.data.id) {
        this.service.getOrgPrimaryUser(data.data.id).subscribe((res: any) => {
          if (res && res.data && res.data.employee_id) {
            this.userForm.patchValue(res.data);
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.getAllOrgTypeMasters();
    this.getAllRoleMaster();
    this.getEntityList();
  }

  onSubmit() {
    const payload = { orgData: this.form.value, userData: this.userForm.value };
    console.log(payload);
    if (this.form.valid && this.userForm.valid) {
      if (this.data.type === 'edit' && this.data.data.id) {
        this.service.updateOrgSetup(this.data.data.id, payload).subscribe(
          (response: any) => {
            this.toast.success(response.message, 'Success');
            this.dialog.close(true);
          },
          (error: HttpErrorResponse) => {
            this.toast.error(error.message, 'Error');
          }
        );
        return;
      }
      this.service.createOrgSetup(payload).subscribe(
        (response: any) => {
          this.toast.success(response.message, 'Success');
          this.dialog.close(true);
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.message, 'Error');
        }
      );
    }
  }

  getAllOrgTypeMasters() {
    this.service.getAllOrgTypeMasters().subscribe((response: any) => {
      this.typeList = response.data.filter((item: any) => item.status);
    });
  }

  getAllRoleMaster() {
    this._empRegistration
      .getAllRoleMaster(this.accssCtrl.getRoleId())
      .subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          let startsWith = '3PL';
          this.roles = res.data
            .filter((res: any) => res.role_master_name.startsWith(startsWith))
            .map((res: any) => ({
              role_master_id: res.role_master_id,
              role_master_name: res.role_master_name,
            }));
        }
      });
  }

  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      this.entities = res.data
        .filter((res: any) => res.entity_id === this.accssCtrl.getEntityId())
        .map((res: any) => ({
          entity_name: res.entity_name,
          entity_id: res.entity_id,
        }));
    });
  };

  onClose(): () => void {
    return () => this.dialog.close(false);
  }
}
