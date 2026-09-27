import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { ThirdPartyService } from '../../services/third-party.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss'],
})
export class CreateUserDialogComponent implements OnInit {
  userForm: FormGroup;
  typeList: any = [];
  roles: any = [];
  entities: any[] = [];

  constructor(
    private dialog: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: ThirdPartyService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private entityService: EntityMasterService,
    private accssCtrl: AccessControlService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      middle_name: [null],
      employee_official_email: ['', [Validators.required, Validators.email]],
      contry_code: ['+91'],
      contact_number: ['', Validators.required],
      role_master_id: ['', Validators.required],
      primary_entity_id: [this.accssCtrl.getEntityId(), Validators.required],
      reporting_manager_id: [
        this.accssCtrl.getEmployeeId(),
        Validators.required,
      ],
      serverUrl: window.location.origin,
      organization_id: [
        this.accssCtrl.getUser()?.organization_id,
        Validators.required,
      ],
    });
    if (data && this.data.type === 'edit') {
      this.userForm.patchValue(data.data);
    }
  }

  ngOnInit(): void {
    this.getAllOrgTypeMasters();
    this.getAllRoleMaster();
    this.getEntityList();
  }

  onSubmit() {
    const payload = { userData: this.userForm.value };
    if (this.userForm.valid) {
      if (this.data.type === 'edit' && this.data.data.employee_id) {
        this.service
          .updateOrgUser(this.data.data.employee_id, payload)
          .subscribe(
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
      this.service.createOrgUser(payload).subscribe(
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
          const orgRole = res.data.find((role: any) => {
            if (role.role_master_id === this.accssCtrl.getRoleId()) {
              return role.role_master_name;
            }
          });

          let startsWith = '3PL_CHA';
          if (orgRole.role_master_name.toLocaleLowerCase().includes('org')) {
            startsWith = '3PL_Org';
          }
          console.log(orgRole, startsWith);

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
