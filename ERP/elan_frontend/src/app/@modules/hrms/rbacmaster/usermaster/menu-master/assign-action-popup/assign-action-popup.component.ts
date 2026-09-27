import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionNotiComponent } from 'src/app/@modules/recuitment-module/interview-status/actionsNoti/actionsNoti.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

interface ModuleAction {
  id: number;
  access: boolean;
  name: string;
}
[];
@Component({
  selector: 'app-assign-action-popup',
  templateUrl: './assign-action-popup.component.html',
  styleUrls: ['./assign-action-popup.component.scss'],
})
export class AssignActionPopupComponent implements OnInit {
  toggleEditMode: boolean = false;
  moduleDetails: any;
  role_id: any;
  // employee_id: any;
  m_title: any;
  showLoader: boolean = false;
  isAccess: boolean = false;

  assignActions: ModuleAction[] = [
    { id: 1, access: false, name: 'Read' },
    { id: 2, access: false, name: 'Write' },
    { id: 3, access: false, name: 'Delete' },
  ];

  constructor(
    private _rbacMasterService: RbacMasterService,
    public dialog: MatDialogRef<AssignActionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toster: ToastrService
  ) {
    this.moduleDetails = data;
    this.role_id = data.role_id;
    // this.employee_id = data.employee_id;
    this.m_title = data.title;
  }

  ngOnInit(): void {
    this.getAction();
  }

  changeAction(e: any) {
    let onAction = this.assignActions.map((a: any) => {
      if (a.id === Number(e.target.value)) {
        return { ...a, access: e.target.checked };
      } else {
        return a;
      }
    });
    this.assignActions = onAction;
  }

  Assign() {
    let access = this.assignActions.find((e: any) => e.access);
    if (!access) {
      this.toster.warning('Any one action is required', 'Assign Action');
      return;
    }
    let action: any = {};
    for (let access of this.assignActions) {
      action[access.name] = access.access;
    }

    delete this.data.title;
    delete this.data.moduleName;
    // delete this.data.role_id;
    const data = { ...this.data, ...action };
    this.moduleAssignAction(this.role_id, data);
  }

  moduleAssignAction(id: any, data: any) {
    this.showLoader = true;
    this._rbacMasterService.moduleAssignAction(id, data).subscribe(
      (res) => {
        console.log(res);
        this.dialog.close();
        this.showLoader = false;
        this.toster.success('Action Assign Successfully');
      },
      (err) => {
        console.log(err);
        this.showLoader = false;
        this.toster.error(
          'somthing went wrong please try again',
          'Error Message'
        );
      }
    );
  }

  getAction() {
    let { role_module_master_id, menu_master_id, submenu_master_id } =
      this.data;
    const body = { role_module_master_id, menu_master_id, submenu_master_id };

    this._rbacMasterService.getAssignAction(this.role_id, body).subscribe(
      (res) => {
        let preAssign = res.data.options;
        for (let el of this.assignActions) {
          for (let key in preAssign) {
            if (el.name === key) {
              el.access = preAssign[key];
              if (preAssign[key]) {
                this.isAccess = true;
              }
            }
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
