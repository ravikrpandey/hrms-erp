import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-lead-form-setup-dialog',
  templateUrl: './add-lead-form-setup-dialog.component.html',
  styleUrls: ['./add-lead-form-setup-dialog.component.scss']
})
export class AddLeadFormSetupDialogComponent implements OnInit {

  fieldTypeList: any = [];
  filterControl = new FormControl();
  leadFormSetupObj: FormGroup = new FormGroup({});
  custonDropdown = new FormControl();
  candidate_id?: number;
  loading: boolean = false;
  nameSearch: any = '';
  config: any;
  loginUser: any;
  filteredFieldTypeList: any = [];
  entity_id: string | null;
  financial_year_id: string | null;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _empService: EmpRegistrationService,
    private recruitService: RecruitService,
    private $crm: CrmService,
    private toast: ToastrService,
    public dialog: MatDialogRef<AddLeadFormSetupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leadFormSetupObj = this.fb.group({
      field_type_id: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
      field_name: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.getFieldType();
    this.dataUpdate();
  }

  dataUpdate() {
    if (this.data) {
      this.leadFormSetupObj.patchValue({
        field_type_id: this.data?.id?.field_type_id,
        field_name: this.data?.id?.field_name,
      });
      let value = this.leadFormSetupObj?.value;
      console.log(value);
    }
  }

  // basicFormPatch() {
  //   this.leadFormSetupObj.patchValue({
  //     field_type_id: this.data?.field_type_id,
  //     field_name: this.data?.field_name,
  //   });
  // }

  // Get field type start
  getFieldType() {
    try {
      this.$crm.getFieldType().subscribe((response: any) => {
        if (response) {
          this.fieldTypeList = response.data;
          this.setfilter();
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get field type end

  onPanelClose() {
    this.filterControl.setValue('');
  }

  // On click submit start
  saveDetails(form: FormGroup) {
    if (this.data?.id?.id) {
      this.updateForm(form)
    }
    else {
      this.submitForm(form)
    }
  }
  // On click submit end

  // Form save start
  submitForm(form: any) {
    try {

      if (form.status === 'INVALID') {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      const formValues = form.value;
      formValues.login_id = this.loginUser?.employee_id;
      formValues.entity_id=this.entity_id;
      formValues.financial_year_id=this.financial_year_id;

      this.$crm.leadFormSetup(formValues).subscribe((response: any) => {
        if (response) {
          this.toast.success('Lead Form Setup Created successfully..');
          this.dialog.close();
        }
      }, err => {
        this.toast.error(err?.error?.message);
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form save end

  // Form update start
  updateForm(form: any) {
    try {
      if (form.status === 'INVALID') {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      let formValues = form.value;
      formValues.id = this.data?.id?.id;
      formValues.login_id = this.loginUser?.employee_id;
      this.$crm.updateLeadFormSetup(formValues).subscribe((response: any) => {
        if (response) {
          this.toast.success('Lead Form Setup Updated successfully..');
          this.reloadCurrentRoute();
          this.dialog.close();
        }
      }, err => {
        console.log(err);
        this.toast.error(err?.error?.message);
      })
    } catch (error) {
      console.log(error);
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    })
  };
  // Form update end

  setfilter(){
    this.filteredFieldTypeList = this.fieldTypeList;
    this.filterControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    ).subscribe(filteredOptions => {
      this.filteredFieldTypeList = filteredOptions;
    });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.fieldTypeList.filter((option:any) =>
      option.field_type.toLowerCase().includes(filterValue)
    );
  }
  }
