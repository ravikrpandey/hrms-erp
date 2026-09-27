import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

const databaseKey: any = environment.servralUrl;

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

export function exactLength(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length === length ? null : { exactLength: true };
  };
}

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent {
  EntityForm: any;
  viewMode: any = false;
  file: any;
  id: any;
  data: any;
  img: any;
  mode: any;
  branchList: any = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private _rbackMasterService: RbacMasterService,
    private config: ConfigurationalmasterService,
    private toaster: ToastrService,
    private financeService: FinaceService,
    private entityService: EntityMasterService,
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.EntityForm = this.fb.group({
      entity_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      tax_registeration_number: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      registered_office: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      employee_prefix: new FormControl(null, [Validators.required]),
      logo: new FormControl(null, [Validators.required]),
      is_group: new FormControl(null, [Validators.required]),
      parent_entity_id: new FormControl(null),
      smtp_server_address: new FormControl(null, [Validators.required, Validators.pattern(/^(?:(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*(?:[A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]|localhost)(?:\.[A-Za-z]{2,})?(?::\d{1,5})?$/), noLeadingSpaces()]),
      smtp_port_no: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      username: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      password: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      financial_id: new FormControl(null, [Validators.required]),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      cin: new FormControl(null),
      pan: new FormControl(null),
      tan: new FormControl(null),
      esi: new FormControl(null),
      pf: new FormControl(null),
      gst_in: new FormControl(null),
      msme_certificate: new FormControl(null),
      msme_category: new FormControl(null),
      branch_id: new FormControl([]),
      stake_holder_form: new FormArray([
        new FormGroup({
          stakeholder_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
          designation: new FormControl(null, [Validators.required, noLeadingSpaces()]),
          contact_no: new FormControl(null, [Validators.required, exactLength(10)]),
          country_code: new FormControl("258", [Validators.required]),
          email_id: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), noLeadingSpaces()]),
        }),
      ]),
      management_form: new FormArray([
        new FormGroup({
          mg_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
          mg_designation: new FormControl(null, [Validators.required, noLeadingSpaces()]),
          mg_contact_no: new FormControl(null, [Validators.required, exactLength(10)]),
          mg_country_code: new FormControl("258", [Validators.required]),
          mg_email_id: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), noLeadingSpaces()]),
        }),
      ]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
      this.clearRequiredValidators();
      this.getFinancialYear()
      this.getAllCountry()
      this.getAllBranch()
      if (this.id) {
        this.getEntityById()
      }
      if (params.mode == "view") {
        this.viewMode = true;
      }
    })
    this.apiOnLoad();
  }

  rowData: any;
  getFinancialYear() {
    this.financeService.getFinancialYear().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("Finance Years List-------", this.rowData);
    }, (err: any) => {
      this.rowData = []
    })
  }

  getAllCountryData: any = []
  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      this.getAllCountryData = res.data;
    });
  }
  getAllBranch() {
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.branchList = res.data;
    });
  }
  getActiveStateData: any = []
  getStateById(event: any) {
    this._empRegistration.getStateByCountry(event.value).subscribe((res: any) => {
      this.getActiveStateData = res.data
    });
  }

  getActiveCityId: any = []
  getCityById(event: any) {
    this._empRegistration.getCityByState(event.value).subscribe((res: any) => {
      this.getActiveCityId = res.data
    });
  }

  clearRequiredValidators = () => {
    if (this.mode === 'edit') {
      this.EntityForm.get('logo')?.clearValidators();
      this.EntityForm.get('logo')?.updateValueAndValidity();
    }
  }

  apiOnLoad() {
    this.getAll_Country_codes()
  }

  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.EntityForm.get('stake_holder_form') as FormArray;
  }

  get managementFormArray() {
    return this.EntityForm.get('management_form') as FormArray;
  }

  onChange = (e: any) => {
    this.file = e.target.files[0]
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (this.file && !allowedTypes.includes(this.file.type)) {
      this.EntityForm.get('logo').setErrors({ acceptTypes: true });
    } else {
      this.EntityForm.get('logo').setErrors(null);
    }
  }

  addStakeHoldersRow() {
    let data = this.fb.group({
      stakeholder_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      designation: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      contact_no: new FormControl(null, [Validators.required, exactLength(10)]),
      country_code: new FormControl("258", [Validators.required]),
      email_id: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), noLeadingSpaces()]),
    });
    this.stakeHoldersFormArray.push(data);

    this.config.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList.push(res.data)
      this.countryCodeList2.push(res.data)
      this.codes[this.codes.length] = this.countryCodeList[this.countryCodeList.length - 1].map((value: any) => value.dialing_code)
    })
  }

  addManagementRow() {
    let data = this.fb.group({
      mg_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      mg_designation: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      mg_contact_no: new FormControl(null, [Validators.required, exactLength(10)]),
      mg_country_code: new FormControl("258", [Validators.required]),
      mg_email_id: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), noLeadingSpaces()]),
    });
    this.managementFormArray.push(data);

    this.config.getAll_Country_codes().subscribe((res: any) => {
      this.managementCountryCodeList.push(res.data)
      this.managementCountryCodeList2.push(res.data)
      this.managementCodes[this.managementCodes.length] = this.managementCountryCodeList[this.managementCountryCodeList.length - 1].map((value: any) => value.dialing_code)
    })
  }

  updateContactNo = (e: any, index: any) => {
    this.EntityForm.get('stake_holder_form')?.at(index).get('contact_no').setValue(e.target.value)
  }

  updateManagementContactNo = (e: any, index: any) => {
    this.EntityForm.get('management_form')?.at(index).get('mg_contact_no').setValue(e.target.value)
  }

  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
  }

  removeManagementRow(index: number): void {
    this.managementFormArray.removeAt(index);
  }

  stakeHolderArrayValidation = () => {
    const stakeholderFormArray = this.EntityForm.get('stake_holder_form') as FormArray;
    const formArrayLength = stakeholderFormArray.length;
    for (let i = 0; i < formArrayLength; i++) {
      for (let j = 0; j < formArrayLength; j++) {
        if (i != j) {
          if ((this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no').value == this.EntityForm.get('stake_holder_form')?.at(j).get('contact_no').value) &&
            (this.EntityForm.get('stake_holder_form')?.at(i).get('country_code').value == this.EntityForm.get('stake_holder_form')?.at(j).get('country_code').value)
          ) return true
          if (this.EntityForm.get('stake_holder_form')?.at(i).get('email_id').value == this.EntityForm.get('stake_holder_form')?.at(j).get('email_id').value) return true
        }
      }
    }
    return false;
  }

  managementArrayValidation = () => {
    const managementFormArray = this.EntityForm.get('management_form') as FormArray;
    const formArrayLength = managementFormArray.length;
    for (let i = 0; i < formArrayLength; i++) {
      for (let j = 0; j < formArrayLength; j++) {
        if (i != j) {
          if ((this.EntityForm.get('management_form')?.at(i).get('mg_contact_no').value == this.EntityForm.get('management_form')?.at(j).get('mg_contact_no').value) &&
            (this.EntityForm.get('management_form')?.at(i).get('mg_country_code').value == this.EntityForm.get('management_form')?.at(j).get('mg_country_code').value)
          ) return true
          if (this.EntityForm.get('management_form')?.at(i).get('mg_email_id').value == this.EntityForm.get('management_form')?.at(j).get('mg_email_id').value) return true
        }
      }
    }
    return false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Stakeholder Country Code Change
  onCountryCodeChange(code: any, i: any) {
    const selectedCode = code;
    this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.clearValidators();

    if (selectedCode === '258') {
      this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.clearValidators();
      this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.setValidators([exactLength(9), Validators.required]);
    } else {
      this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.clearValidators();
      this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.setValidators([
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.required
      ]);
    }
    this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')?.updateValueAndValidity();
  }

  // Management Country Code Change
  onManagementCountryCodeChange(code: any, i: any) {
    const selectedCode = code;
    this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.clearValidators();

    if (selectedCode === '258') {
      this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.clearValidators();
      this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.setValidators([exactLength(9), Validators.required]);
    } else {
      this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.clearValidators();
      this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.setValidators([
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.required
      ]);
    }
    this.EntityForm.get('management_form')?.at(i).get('mg_contact_no')?.updateValueAndValidity();
  }

  onSubmitForm = () => {
    this.markFormGroupTouched(this.EntityForm);
    if (this.stakeHolderArrayValidation()) {
      this.toaster.error('Values can not be duplicated in StakeHolders Input Rows', 'Error')
      return
    }
    if (this.managementArrayValidation()) {
      this.toaster.error('Values can not be duplicated in Management Input Rows', 'Error')
      return
    }
    if (this.EntityForm.invalid) {
      Object.keys(this.EntityForm.controls).forEach(controlName => {
        const control = this.EntityForm.get(controlName);
        if (control && control.invalid) {
          console.log(control, "---")
        }
      });
      this.toaster.error('All field should be valid', 'Error')
      return
    }

    let val = this.EntityForm.value;
    const formData = new FormData();
    formData.append('entity_name', val.entity_name);
    formData.append('tax_registeration_number', val.tax_registeration_number);
    formData.append('registered_office', val.registered_office);
    formData.append('employee_prefix', val.employee_prefix);
    formData.append('smtp_server_address', val.smtp_server_address);
    formData.append(`smtp_port_no`, val.smtp_port_no);
    formData.append(`username`, val.username);
    formData.append('password', val.password);
    formData.append('parent_entity_id', val.parent_entity_id);
    formData.append('is_group', val.is_group);
    formData.append('financial_id', val.financial_id);
    formData.append('country_id', val.country_id);
    formData.append('state_id', val.state_id);
    formData.append('city_id', val.city_id);
    formData.append('cin', val.cin);
    formData.append('pan', val.pan);
    formData.append('tan', val.tan);
    formData.append('pf', val.pf);
    formData.append('gst_in', val.gst_in);
    formData.append('esi', val.cin);
    formData.append('msme_certificate', val.msme_certificate);
    formData.append('msme_category', val.msme_category);
    if (val.branch_id && Array.isArray(val.branch_id)) {
      formData.append('branch_id', val.branch_id.join(','));
  } else {
      formData.append('branch_id', val.branch_id);
  }

    // Stakeholder Form
    val.stake_holder_form = val.stake_holder_form.map((row: any) => {
      let temp = {
        stakeholder_name: row.stakeholder_name,
        designation: row.designation,
        country_code: row.country_code,
        contact_no: row.contact_no,
        email_id: row.email_id
      };
      return temp;
    })
    let jsonStr = JSON.stringify(val.stake_holder_form)
    formData.append('stake_holder_form', jsonStr);

    // Management Form
    val.management_form = val.management_form.map((row: any) => {
      let temp = {
        mg_name: row.mg_name,
        mg_designation: row.mg_designation,
        mg_country_code: row.mg_country_code,
        mg_contact_no: row.mg_contact_no,
        mg_email_id: row.mg_email_id
      };
      return temp;
    })
    let managementJsonStr = JSON.stringify(val.management_form)
    formData.append('management_form', managementJsonStr);

    formData.delete('file');
    formData.append('file', this.file);

    if (!this.id) {
      this._commonService?.showLoader()
      this.entityService.createEntity(formData).subscribe((res: any) => {
        if (res) {
          this._commonService?.hideLoader()
          this.toaster.success(res.message);
          this.router.navigate(["master/entity/entity-list"]);
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
    else {
      this._commonService?.showLoader()
      this.entityService.updateEntity(formData, this.id).subscribe((res: any) => {
        if (res) {
          this._commonService?.hideLoader()
          this.toaster.success(res.message);
          this.router.navigate(["master/entity/entity-list"]);
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
  }

  back = () => {
    this.router.navigate(["master/entity/entity-list"]);
  }

  // Stakeholder Code Search
  codeSearch(e: any, i: any) {
    const aa = e
    let filteredVariable = this.countryCodeList2[i].filter((item: any) => aa.includes(item.dialing_code));
    this.countryCodeList[i] = filteredVariable
  }

  // Management Code Search
  managementCodeSearch(e: any, i: any) {
    const aa = e
    let filteredVariable = this.managementCountryCodeList2[i].filter((item: any) => aa.includes(item.dialing_code));
    this.managementCountryCodeList[i] = filteredVariable
  }

  countryCodeList: any = [[]];
  countryCodeList2: any = [[]];
  codes: any = [[]]

  managementCountryCodeList: any = [[]];
  managementCountryCodeList2: any = [[]];
  managementCodes: any = [[]]

  getAll_Country_codes(length?: any) {
    this.config.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList[0] = res.data
      this.countryCodeList2[0] = res.data
      this.codes[0] = this.countryCodeList[0].map((value: any) => value.dialing_code)

      this.managementCountryCodeList[0] = res.data
      this.managementCountryCodeList2[0] = res.data
      this.managementCodes[0] = this.managementCountryCodeList[0].map((value: any) => value.dialing_code)

      if (length) {
        for (let i = 1; i < length; i++) {
          this.countryCodeList[i] = this.countryCodeList[0]
          this.countryCodeList2[i] = this.countryCodeList2[0]
          this.codes[i] = this.codes[0]

          this.managementCountryCodeList[i] = this.managementCountryCodeList[0]
          this.managementCountryCodeList2[i] = this.managementCountryCodeList2[0]
          this.managementCodes[i] = this.managementCodes[0]
        }
      }
    })
  }

  getEntityById() {
    try {
      this._commonService?.showLoader()
      this.entityService.getEntity(this.id).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          this.data = response.data;

          this._empRegistration.getStateByCountry(this.data.country_id).subscribe((res: any) => {
            this.getActiveStateData = res.data
          });
          this._empRegistration.getCityByState(this.data.state_id).subscribe((res: any) => {
            this.getActiveCityId = res.data
          });

          this.img = databaseKey + '/uploaded_files/' + this.data.logo;
          let branchIds = [];
          if (this.data.branch_id) {
              if (typeof this.data.branch_id === 'string') {
                  branchIds = this.data.branch_id.split(',').map(Number);
              } else if (Array.isArray(this.data.branch_id)) {
                  branchIds = this.data.branch_id;
              } else {
                  branchIds = [this.data.branch_id];
              }
          }
          this.EntityForm.patchValue({
            entity_name: this.data.entity_name,
            tax_registeration_number: this.data.tax_registration_number,
            registered_office: this.data.registered_office,
            employee_prefix: this.data.employee_prefix || '',
            smtp_server_address: this.data.smtp_server_address,
            smtp_port_no: this.data.smtp_port_number,
            username: this.data.smtp_username,
            password: this.data.smtp_password,
            financial_id: this.data.financial_id,
            country_id: this.data.country_id,
            state_id: this.data.state_id,
            city_id: this.data.city_id,
            is_group: this.data.is_group || 'NO',
            parent_entity_id: this.data.parent_entity_id,
            cin: this.data.cin,
            pan: this.data.pan,
            tan: this.data.tan,
            esi: this.data.esi,
            pf: this.data.pf,
            gst_in: this.data.gst_in,
            msme_certificate: this.data.msme_certificate,
            msme_category: this.data.msme_category,
             branch_id: branchIds,
          });

          // Handle Stakeholders
          if (this.stakeHoldersFormArray.length > 0) {
            this.getAll_Country_codes(this.stakeHoldersFormArray.length)
            const firstRow = this.stakeHoldersFormArray.at(0) as FormGroup;
            if (firstRow && this.data.stakeholders && this.data.stakeholders.length > 0) {
              firstRow.patchValue({
                stakeholder_name: this.data.stakeholders[0]?.stakeholder_name,
                designation: this.data.stakeholders[0]?.stakeholder_designation,
                contact_no: this.data.stakeholders[0]?.stakeholder_contact_no,
                country_code: String(this.data.stakeholders[0]?.stakeholder_country_code),
                email_id: this.data.stakeholders[0]?.stakeholder_email_id
              });
              this.onCountryCodeChange(this.data.stakeholders[0]?.stakeholder_country_code, 0)
            }
          }

          while (this.stakeHoldersFormArray.length > 1) {
            this.stakeHoldersFormArray.removeAt(1);
          }

          if (this.data.stakeholders && this.data.stakeholders.length > 1) {
            for (let i = 1; i < this.data.stakeholders.length; i++) {
              this.addStakeHoldersRow();
              const formGroup = this.stakeHoldersFormArray.at(i) as FormGroup;
              if (formGroup) {
                formGroup.patchValue({
                  stakeholder_name: this.data.stakeholders[i]?.stakeholder_name,
                  designation: this.data.stakeholders[i]?.stakeholder_designation,
                  contact_no: this.data.stakeholders[i]?.stakeholder_contact_no,
                  country_code: String(this.data.stakeholders[i]?.stakeholder_country_code),
                  email_id: this.data.stakeholders[i]?.stakeholder_email_id
                });
              }
              this.onCountryCodeChange(this.data.stakeholders[i]?.stakeholder_country_code, i)
            }
          }

          // Handle Management Details
          if (this.managementFormArray.length > 0) {
            this.getAll_Country_codes(this.managementFormArray.length)
            const firstMgRow = this.managementFormArray.at(0) as FormGroup;
            if (firstMgRow && this.data.management && this.data.management.length > 0) {
              firstMgRow.patchValue({
                mg_name: this.data.management[0]?.mg_name,
                mg_designation: this.data.management[0]?.mg_designation,
                mg_contact_no: this.data.management[0]?.mg_contact_no,
                mg_country_code: String(this.data.management[0]?.mg_country_code),
                mg_email_id: this.data.management[0]?.mg_email_id
              });
              this.onManagementCountryCodeChange(this.data.management[0]?.mg_country_code, 0)
            }
          }

          while (this.managementFormArray.length > 1) {
            this.managementFormArray.removeAt(1);
          }

          if (this.data.management && this.data.management.length > 1) {
            for (let i = 1; i < this.data.management.length; i++) {
              this.addManagementRow();
              const formGroup = this.managementFormArray.at(i) as FormGroup;
              if (formGroup) {
                formGroup.patchValue({
                  mg_name: this.data.management[i]?.mg_name,
                  mg_designation: this.data.management[i]?.mg_designation,
                  mg_contact_no: this.data.management[i]?.mg_contact_no,
                  mg_country_code: String(this.data.management[i]?.mg_country_code),
                  mg_email_id: this.data.management[i]?.mg_email_id
                });
              }
              this.onManagementCountryCodeChange(this.data.management[i]?.mg_country_code, i)
            }
          }

          // Get Parent Entity List for dropdown
          this.getAllCostCenterIsGroup('YES');
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  getAllIsGroup: any = []
  IsGroupData(data: any) {
    if (data.value == 'YES') {
      this.EntityForm.get('financial_id').disable()
      this.EntityForm.get('financial_id').reset()
    } else if (data.value == 'NO') {
      this.EntityForm.get('financial_id').enable()
    }
    if (data.value == 'YES') {
      this.getAllCostCenterIsGroup('YES');
    } else {
      this.isGroupDatalist = []
    }
  }

  isGroupDatalist: any = []
  getAllCostCenterIsGroup(data: any) {
    this.entityService.getAllIsgroupData(data).subscribe((res: any) => {
      if (res.data) {
        this.isGroupDatalist = res.data;
      }
    })
  }
}