import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-kt-master-create-dialog',
  templateUrl: './kt-master-create-dialog.html',
  styleUrls: ['./kt-master-create-dialog.scss']
})
export class KtMasterCreateDialog {

  ktForm: FormGroup;
  singleGrade: any;
  entity_Id: any;
  loginUser: any;

  formMode: 'add' | 'edit' | 'view' = 'add';  // ⭐ MAIN FLAG (HTML uses this)
  listGrade: any;   // id
visible: any;

  constructor(
    private dialog: MatDialogRef<KtMasterCreateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {

    this.ktForm = this._fb.group({
      category_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });

    this.listGrade = data.id; // id for edit/view
  }

  ngOnInit() {
    this.loadLocalStorage();

    // ⭐ VIEW MODE
    if (this.data?.visible === 'visible') {
      this.formMode = 'view';
      this.getById();
      return;
    }

    // ⭐ EDIT MODE
    if (this.data?.grade === 'edit') {
      this.formMode = 'edit';
      this.getById();
      return;
    }

    // ⭐ ADD MODE
    if (this.data?.grade === 'add') {
      this.formMode = 'add';
      return;
    }
  }

  loadLocalStorage() {
    const a: any = localStorage.getItem('signInUser');
    const entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  // ⭐ GET DETAILS FOR EDIT / VIEW
  getById() {
    this._configurationalmasterService
      .KtCategoryById(this.listGrade)
      .subscribe((res: any) => {
        this.singleGrade = res.data;

        // ⭐ SET VALUES FOR EDIT
        if (this.formMode === 'edit') {
          this.ktForm.patchValue({
            category_name: this.singleGrade.category_name,
            description: this.singleGrade.description
          });
        }
      });
  }

  // Refresh page
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  // ⭐ SUBMIT FORM (CREATE + UPDATE)
  ngSubmitEmp(data: any) {

    if (this.ktForm.invalid) return;

    // ⭐ UPDATE (EDIT MODE)
    if (this.formMode === 'edit') {
      this._configurationalmasterService.KtCategoryUpdate(this.listGrade, data)
        .subscribe(
          (res: any) => {
            if (res.message === "KT Category Name already exists!") {
              this.toaster.warning('KT Category Name already exists!');
            } else {
              this.toaster.success('Updated successfully!');
              this.reloadCurrentRoute();
              this.dialog.close();
              this.ktForm.reset();
            }
          },
          (err: any) => {
            this.handleError(err);
          }
        );

      return;
    }

    // ⭐ CREATE (ADD MODE)
    if (this.formMode === 'add') {
      data.entity_id = this.entity_Id;

      this._configurationalmasterService.createKtCategory(data)
        .subscribe(
          (res: any) => {
            if (res.message === " already exists!") {
              this.toaster.warning('KT Category Name already exists!');
            } else {
              this.toaster.success('Added successfully!');
              this.reloadCurrentRoute();
              this.dialog.close();
              this.ktForm.reset();
            }
          },
          (err: any) => {
            this.handleError(err);
          }
        );
    }
  }

  // ⭐ COMMON ERROR HANDLER
  handleError(err: any) {
    if (err.status == 400) {
      this.toaster.error('Something went Wrong!');
    } else if (err.status == 409) {
      this.toaster.warning('KT Category Name already exists!');
    } else {
      this.toaster.error('Error in submission!');
    }
  }
}
