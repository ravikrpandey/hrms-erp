import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MenuManagementService } from 'src/app/@shared/services/menu-management.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss'],
})
export class MenuDialogComponent implements OnInit {
  form: FormGroup;
  hideFields: Boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    private fb: FormBuilder,
    private menuApi: MenuManagementService,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      id: [data.mode === 'update' ? data.menu.id : null],
      name: [data.mode === 'update' ? data.menu.name : null],
      path: [data.mode === 'update' ? data.menu.path : null],
      icon: [data.mode === 'update' ? data.menu.icon : null],
      title: [
        data.type === 'parent'
          ? null
          : data.mode === 'update'
          ? data.menu.title
          : data.menu.title,
      ],
      order: [data.mode === 'update' ? data.menu.order : null],
      parentId: [
        data.type === 'parent'
          ? null
          : data.mode === 'create'
          ? data.menu.id
          : data.menu.parentId,
      ],
    });

    if (window.location.origin === 'http://localhost:4200') {
      this.hideFields = false;
    }
  }

  ngOnInit(): void {}

  onSave() {
    this.menuApi.createUpdateMenu(this.form.value).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.dialogRef.close(res);
      },
      (error) => {
        this.toast.error(error.error.message);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
