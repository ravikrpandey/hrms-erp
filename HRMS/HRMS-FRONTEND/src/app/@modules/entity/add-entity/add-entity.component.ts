import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { environment } from 'src/app/environments/environment';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

const databaseKey: any = environment.serverUrl;
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss'],
})
export class AddEntityComponent {
  hide = true;
  EntityForm: any;
  viewMode: any = false;
  file: any;
  id: any;
  data: any;
  img: any;
  mode: any;
  countryList: any;
  currencySymbol: any;
  currency_id: any = null;
  companyList: any;
  checkData: any = [];
  variables: any = [];
  branchVar1: any = [];
  branchVar2: any = [];
  CompanyVar: any = [];
  CompanyVar1: any = [];
  existingCompanyLogo: string | null = null;
  existingSignatureLogo: string | null = null;
  companyLogoFile: File | null = null;
  signatureLogoFile: File | null = null;
  companyLogoUrl: string | null = null;
  signatureLogoUrl: string | null = null;
  company_name: any;
  branch_name: any;
  stateVar: any;
  stateList: any;
  stateVar2: any;
  filterStateList: any;
  getData: any;
  getCurrencyData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService,
    private location: Location,
    private _rbackMasterService: RbacMasterService,
    private config: ConfigurationalmasterService,
    private toaster: ToastrService,
    private entityService: EntityMasterService,
    private _empRegistration: EmpRegistrationService
  ) {
    // shiftMasterForm
    this.EntityForm = this.fb.group({
      entity_name: new FormControl(null, [Validators.required]),
      branch_id: new FormControl(null, [Validators.required]),
      company_logo: new FormControl(null, [Validators.required]),
      signature_logo: new FormControl(null),
      tax_registeration_number: new FormControl(null),
      registered_office: new FormControl(null),
      pf: new FormControl(null, [
        Validators.required,
      ]),
      esic: new FormControl(null),
      tan: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]$/), // 10-character TAN
      ]),
      pan: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/), // 10-character PAN
      ]),
      lin: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{11}$/),
      ]),
      gst: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
        ), // 15-char GSTIN
      ]),
      registration_certificate: new FormControl(null),

      // smtp_server_address: new FormControl(null, [Validators.required,Validators.pattern(/^(?!:\/\/)(?=[a-zA-Z0-9-]{1,63}\.)([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.){1,126}[a-zA-Z]{2,63}$/) ]),
      smtp_server_address: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?:(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*(?:[A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]|localhost)(?:\.[A-Za-z]{2,})?(?::\d{1,5})?$/
        ),
      ]),
      smtp_port_no: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
      ]),
      username: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
      country_id: new FormControl(null, [Validators.required]),
      company_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      zip_code: new FormControl(null, [Validators.required]),
      currency_id: new FormControl(null, [Validators.required]),
      employee_code_prefix: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      employer_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      stake_holder_form: new FormArray([
        new FormGroup({
          stakeholder_name: new FormControl(null, [noLeadingSpaces()]),
          designation: new FormControl(null, [noLeadingSpaces()]),
          contact_no: new FormControl(null),
          email_id: new FormControl(null, [
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
            noLeadingSpaces(),
          ]),
        }),
      ]),
    });
    this.touppercase();
  }

  touppercase() {
    this.EntityForm.controls['employee_code_prefix'].valueChanges.subscribe(
      (value: any) => {
        if (value) {
          const uppercaseValue = value.toUpperCase();
          this.EntityForm.controls['employee_code_prefix'].setValue(
            uppercaseValue,
            { emitEvent: false }
          );
        }
      }
    );
  }

  countryFilter(e: any) {
    const aa = e;
    let filteredVariable = this.checkData.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.countryList = filteredVariable;
  }
  companyFilter(e: any) {
    const aa = e;
    let filteredVariable = this.CompanyVar1.filter((item: any) =>
      aa.includes(item.company_name)
    );
    this.companyList = filteredVariable;
  }
  branchFilter(e: any) {
    const aa = e;
    let filteredVariable = this.branchVar2.filter((item: any) =>
      aa.includes(item.branch_name)
    );
    this.branchList = filteredVariable;
  }
  ngOnInit(): void {
    this.apiOnLoad();
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params?.id;
      this.mode = params?.mode;
      this.clearRequiredValidators();

      if (this.EntityForm.get('country_id')?.value !== 'IN') {
        ['pf', 'esic', 'tan', 'pan', 'lin', 'gst', 'registration_certificate'].forEach(field => {
          const control = this.EntityForm.get(field);
          if (control) {
            control.clearValidators();
            control.updateValueAndValidity();
          }
        });
      }
      if (this.id) {
        this.getEntityById();
      }
      if (params.mode == 'view') {
        this.viewMode = true;
      }
    });
    this.getAllCurrency();
  }

  clearRequiredValidators = () => {
    if (this.mode === 'edit') {
      this.EntityForm.get('company_logo')?.clearValidators();
      this.EntityForm.get('company_logo')?.updateValueAndValidity();
      this.EntityForm.get('signature_logo')?.clearValidators();
      this.EntityForm.get('signature_logo')?.updateValueAndValidity();
    }
  };

  async apiOnLoad() {
    Promise.all([
      this.getAllCountry(),
      this.get_all_company_list(),
      this.getBranchList(),
    ]);
  }
  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.EntityForm.get('stake_holder_form') as FormArray;
  }


  addStakeHoldersRow() {
    let data = this.fb.group({
      stakeholder_name: new FormControl(null),
      designation: new FormControl(null),
      contact_no: new FormControl(null),
      email_id: new FormControl(null),
    });
    this.stakeHoldersFormArray.push(data);
  }

  updateContactNo = (e: any, index: any) => {
    this.EntityForm.get('stake_holder_form')
      ?.at(index)
      .get('contact_no')
      .setValue(e.target.value);
  };

  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
  }

  stakeHolderArrayValidation = () => {
    const stakeholderFormArray = this.EntityForm.get(
      'stake_holder_form'
    ) as FormArray;
    const formArrayLength = stakeholderFormArray.length;
    for (let i = 0; i < formArrayLength; i++) {
      for (let j = 0; j < formArrayLength; j++) {
        if (i != j) {
          if (
            this.EntityForm.get('stake_holder_form')?.at(i).get('contact_no')
              .value ==
            this.EntityForm.get('stake_holder_form')?.at(j).get('contact_no')
              .value
          )
            return true;
          if (
            this.EntityForm.get('stake_holder_form')?.at(i).get('email_id')
              .value ==
            this.EntityForm.get('stake_holder_form')?.at(j).get('email_id')
              .value
          )
            return true;
        }
      }
    }
    return false;
  };

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormGroup<any>) => {
        control.markAsTouched();

        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }
  onSubmitForm = () => {
    this.markFormGroupTouched(this.EntityForm);

    if (this.stakeHolderArrayValidation()) {
      this.toaster.error(
        'Values can not be duplicated in stakeHolders input rows!',
        'Error'
      );
      return;
    }

    if (this.EntityForm.invalid) {
      Object.keys(this.EntityForm.controls).forEach((key) => {
        const control = this.EntityForm.get(key);
        if (control?.invalid) {
          console.log(
            ` Invalid field: ${key}`,
            control.errors,
            'Current value:',
            control.value
          );
        }
      });
      this.toaster.error('All fields are required!');
      return;
    }

    let val = this.EntityForm.value;
    const formData = new FormData();

    formData.append('entity_name', val.entity_name);
    formData.append('country_id', val.country_id);
    formData.append('company_id', val.company_id);
    formData.append('employee_code_prefix', val.employee_code_prefix);
    formData.append('employer_name', val.employer_name);
    formData.append('tax_registeration_number', val.tax_registeration_number);
    formData.append('registered_office', val.registered_office);
    formData.append('smtp_server_address', val.smtp_server_address);
    formData.append('smtp_port_no', val.smtp_port_no);
    formData.append('username', val.username);
    formData.append('password', val.password);
    formData.append('branch_id', val.branch_id);
    formData.append('state_id', val.state_id);
    formData.append('zip_code', val.zip_code);
    formData.append('currency_id', val.currency_id);
    formData.append('address', val.address);
    formData.append('pf', val.pf);
    formData.append('esic', val.esic);
    formData.append('tan', val.tan);
    formData.append('pan', val.pan);
    formData.append('lin', val.lin);
    formData.append('gst', val.gst);
    formData.append('registration_certificate', val.registration_certificate);

    // Stakeholders JSON
    const stakeholders = val.stake_holder_form.map((row: any) => ({
      stakeholder_name: row.stakeholder_name,
      designation: row.designation,
      contact_no: row.contact_no,
      email_id: row.email_id,
    }));
    formData.append('stake_holder_form', JSON.stringify(stakeholders));

    // --- Handle files ---
    if (this.companyLogoFile) {
      // New company logo selected
      formData.append('company_logo', this.companyLogoFile);
    } else if (this.data?.logo) {
      // No new file, keep existing
      formData.append('company_logo', this.data.logo);
    }

    if (this.signatureLogoFile) {
      // New signature logo selected
      formData.append('signature_logo', this.signatureLogoFile);
    } else if (this.data?.signature_logo) {
      // No new file, keep existing
      formData.append('signature_logo', this.data.signature_logo);
    }

    // Company branch
    formData.append(
      'company_branch',
      this.company_name + '-' + this.branch_name
    );

    if (!this.id) {
      this.entityService.createEntity(formData).subscribe(
        (res: any) => {
          this.toaster.success(res.message);
          this.router.navigate([
            '/master/configurational-master/entity-list',
          ]);
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.router.navigate([
            '/master/configurational-master/entity-list',
          ]);
        }
      );
    } else {
      this.entityService.updateEntity(formData, this.id).subscribe(
        (res: any) => {
          this.toaster.success(res.message);
          this.router.navigate([
            '/master/configurational-master/entity-list',
          ]);
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.router.navigate([
            '/master/configurational-master/entity-list',
          ]);
        }
      );
    }
  };


  back = () => {
    this.router.navigate(['/master/configurational-master/entity-list']);
  };
  getStateByCountry(countryId: any) {
    this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
      if (res && res.data) {
        this.stateList = res.data;

        // Set filtered list directly (for dropdown)
        this.filterStateList = this.stateList;

        // If you need separate vars (like in your other module)
        this.stateVar = this.stateList.map((s: any) => s.states_name);
        this.stateVar2 = this.stateList;

        // Optional: if you want to auto-select a state when editing form
        if (this.getData) {
          this.EntityForm.controls['state_id'].patchValue(
            Number(this.getData?.state_id)
          );
        }
      }
    });
  }

  stateFilter(e: any) {
    let filtered = this.stateList.filter((item: any) =>
      e.includes(item.states_name)
    );
    this.filterStateList = filtered;
  }

  // getEntityById() {
  //   try {
  //     this.entityService.getEntity(this.id).subscribe(
  //       (response: any) => {
  //         if (response) {
  //           this.data = response.data;

  //           // ✅ store existing paths for later use
  //           this.existingCompanyLogo = this.data?.logo || null;
  //           this.existingSignatureLogo = this.data?.signature_logo || null;

  //           // for preview display
  //           this.companyLogoUrl = this.existingCompanyLogo
  //             ? databaseKey + '/uploaded_files/' + this.existingCompanyLogo
  //             : null;

  //           this.signatureLogoUrl = this.existingSignatureLogo
  //             ? databaseKey + '/uploaded_files/' + this.existingSignatureLogo
  //             : null;

  //           // country selection + fetch states
  //           if (this.data?.country_id) {
  //             this.selectedCountry = this.countryList?.find(
  //               (elem: any) => elem?.countryss_id == this.data?.country_id
  //             );

  //             // Fetch states and patch state_id inside it
  //             this.getStateByCountry(this.data?.country_id);
  //           }

  //           // company selection
  //           if (this.companyList?.length) {
  //             this.selectedCompany = this.companyList?.find(
  //               (elem: any) => elem?.id == this.data?.company_id
  //             );
  //             this.company_name = this.selectedCompany?.company_name || null;
  //           }

  //           // branch selection
  //           if (this.branchList?.length) {
  //             this.selectedBranchObj = this.branchList?.find(
  //               (elem: any) => elem?.id == this.data?.branch_id
  //             );
  //             this.branch_name = this.selectedBranchObj?.branch_name || null;
  //           }

  //           // main entity form patch (without state_id here)
  //           this.EntityForm.patchValue({
  //             entity_name: this.data.entity_name,
  //             country_id: this.data.country_id,
  //             state_id: this.data.state_id,
  //             zip_code: this.data.zip_code,
  //             currency_id: this.data.currency_id,
  //             address: this.data.address,
  //             company_id: this.data.company_id,
  //             employee_code_prefix: this.data.employee_code_prefix,
  //             employer_name: this.data.employer_name,
  //             tax_registration_number: this.data.tax_registration_number,
  //             registered_office: this.data.registered_office,
  //             smtp_server_address: this.data.smtp_server_address,
  //             smtp_port_no: this.data.smtp_port_number,
  //             username: this.data.smtp_username,
  //             password: this.data.smtp_password,
  //             branch_id: this.data.branch_id,
  //             pf: this.data.pf_number,
  //             esic: this.data.esic_number,
  //             tan: this.data.tan_number,
  //             pan: this.data.pan_number,
  //             lin: this.data.lin_number,
  //             gst: this.data.gst_number,
  //             registration_certificate: this.data.registration_certificate_number
  //           });

  //           // --- stakeholders array patch ---
  //           this.stakeHoldersFormArray.clear();

  //           if (this.data.stakeholders?.length) {
  //             this.data.stakeholders.forEach((s: any) => {
  //               this.stakeHoldersFormArray.push(
  //                 this.fb.group({
  //                   stakeholder_name: [s.stakeholder_name],
  //                   designation: [s.stakeholder_designation],
  //                   contact_no: [s.stakeholder_contact_no],
  //                   email_id: [s.stakeholder_email_id],
  //                 })
  //               );
  //             });
  //           }
  //         }
  //       },
  //       (err: any) => {
  //         console.log(err);
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  getEntityById() {
    try {
      this.entityService.getEntity(this.id).subscribe(
        (response: any) => {
          if (response) {
            this.data = response.data;

            // ✅ store existing paths for later use
            this.existingCompanyLogo = this.data?.logo || null;
            this.existingSignatureLogo = this.data?.signature_logo || null;

            // for preview display
            this.companyLogoUrl = this.existingCompanyLogo
              ? databaseKey + '/uploaded_files/' + this.existingCompanyLogo
              : null;

            this.signatureLogoUrl = this.existingSignatureLogo
              ? databaseKey + '/uploaded_files/' + this.existingSignatureLogo
              : null;

            // country selection + fetch states
            if (this.data?.country_id) {
              this.selectedCountry = this.countryList?.find(
                (elem: any) => elem?.countryss_id == this.data?.country_id
              );

              // Fetch states and patch state_id inside it
              this.getStateByCountry(this.data?.country_id);
            }

            // company selection
            if (this.companyList?.length) {
              this.selectedCompany = this.companyList?.find(
                (elem: any) => elem?.id == this.data?.company_id
              );
              this.company_name = this.selectedCompany?.company_name || null;
            }

            // branch selection
            if (this.branchList?.length) {
              this.selectedBranchObj = this.branchList?.find(
                (elem: any) => elem?.id == this.data?.branch_id
              );
              this.branch_name = this.selectedBranchObj?.branch_name || null;
            }

            // main entity form patch (without state_id here)
            this.EntityForm.patchValue({
              entity_name: this.data.entity_name,
              country_id: this.data.country_id,
              state_id: this.data.state_id,
              zip_code: this.data.zip_code,
              currency_id: this.data.currency_id,
              address: this.data.address,
              company_id: this.data.company_id,
              employee_code_prefix: this.data.employee_code_prefix,
              employer_name: this.data.employer_name,
              tax_registration_number: this.data.tax_registration_number,
              registered_office: this.data.registered_office,
              smtp_server_address: this.data.smtp_server_address,
              smtp_port_no: this.data.smtp_port_number,
              username: this.data.smtp_username,
              password: this.data.smtp_password,
              branch_id: this.data.branch_id,
              pf: this.data.pf_number,
              esic: this.data.esic_number,
              tan: this.data.tan_number,
              pan: this.data.pan_number,
              lin: this.data.lin_number,
              gst: this.data.gst_number,
              registration_certificate: this.data.registration_certificate_number
            });

            // --- stakeholders array patch ---
            this.stakeHoldersFormArray.clear();
            if (this.data.stakeholders?.length) {
              this.data.stakeholders.forEach((s: any) => {
                this.stakeHoldersFormArray.push(
                  this.fb.group({
                    stakeholder_name: [s.stakeholder_name],
                    designation: [s.stakeholder_designation],
                    contact_no: [s.stakeholder_contact_no],
                    email_id: [s.stakeholder_email_id],
                  })
                );
              });
            }
            else {
              //  Add one empty row if no stakeholders
              this.stakeHoldersFormArray.push(
                this.fb.group({
                  stakeholder_name: [''],
                  designation: [''],
                  contact_no: [''],
                  email_id: [''],
                })
              );
            }

            //  Re-apply country-specific validators after patch
            if (this.data?.country_id) {
              this.countrySelect(this.data.country_id, 'country');
            }

            // ✅ Force all controls to recalc validity
            Object.keys(this.EntityForm.controls).forEach((k) => {
              this.EntityForm.get(k)?.updateValueAndValidity();
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  filterCountry: any;
  filterCountryList: any;
  getAllCountry() {
    this.entityService.getAllcountry().subscribe((res: any) => {
      this.countryList = res.data;
      this.filterCountryList = this.countryList.slice();
      this.variables = this.countryList?.map((res: any) => res.countryss_name);
      this.checkData = this.countryList;
    });
  }

  companyNamefilter: any;
  get_all_company_list() {
    this.entityService.get_all_company_list().subscribe((res: any) => {
      this.companyList = res.data;
      this.CompanyVar = this.companyList?.map((res: any) => res.company_name);
      this.CompanyVar1 = this.companyList;
      this.companyNamefilter = this.CompanyVar1.slice();
    });
  }

  selectedCountry: any;
  selectedCompany: any;
  selectedBranchObj: any;
  getAllCurrency() {
    this.payrollService.getCurrency().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.getCurrencyData = res.data;

          if (this.currency_id) {
            this.currencySelect({ value: this.currency_id });
          }
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }
  onChangeCompanyLogo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.companyLogoFile = file;
      this.companyLogoUrl = URL.createObjectURL(file);

      //  Mark the form control as filled
      this.EntityForm.get('company_logo')?.setValue(file);
      this.EntityForm.get('company_logo')?.updateValueAndValidity();
    }
  }

  onChangeSignatureLogo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.signatureLogoFile = file;
      this.signatureLogoUrl = URL.createObjectURL(file);
      this.EntityForm.get('signature_logo')?.setValue(file);
      this.EntityForm.get('signature_logo')?.updateValueAndValidity();
    }
  }

  currencySelect(e: any) {
    this.getCurrencyData?.forEach((cur: any) => {
      if (e?.value === cur?.Currency_Convert_id) {
        this.currencySymbol = cur?.symbols;
      }
    });
  }

  countrySelect(selectedId: any, selectionType: any) {
    if (selectionType == 'country') {
      this.selectedCountry = this.countryList.find(
        (country: any) => country.countryss_id == selectedId
      );

      this.getStateByCountry(selectedId);

      // Check if selected country is India
      if (this.selectedCountry?.country_code === 'IN') {
        // Make these required and apply pattern validators
        const fieldValidators: any = {
          pf: [
            Validators.required,
            Validators.pattern('^[A-Z]{2}[A-Z]{3}\\d{7}[A-Z]{3}\\d{7}$')
          ],

          esic: [Validators.required, Validators.pattern('^\\d{2}[–-]?\\d{2}[–-]?\\d{6}[–-]?\\d{3}[–-]?\\d{4}$')],
          tan: [
            Validators.required,
            Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]$/),
          ],
          pan: [
            Validators.required,
            Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
          ],
          lin: [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
          gst: [
            Validators.required,
            Validators.pattern(
              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
            ),
          ],
          registration_certificate: [Validators.required],
        };

        Object.keys(fieldValidators).forEach((field) => {
          const control = this.EntityForm.get(field);
          if (control) {
            control.setValidators(fieldValidators[field]);
            control.updateValueAndValidity();
          }
        });

        // Clear validators for tax_registeration_number & registered_office
        ['tax_registeration_number', 'registered_office'].forEach((field) => {
          const control = this.EntityForm.get(field);
          if (control) {
            control.clearValidators();
            control.updateValueAndValidity();
          }
        });
      } else {
        // For other countries, clear IN-specific validators
        [
          'pf',
          'esic',
          'tan',
          'pan',
          'lin',
          'gst',
          'registration_certificate',
        ].forEach((field) => {
          const control = this.EntityForm.get(field);
          if (control) {
            control.clearValidators();
            control.updateValueAndValidity();
          }
        });
      }
    } else if (selectionType == 'company') {
      this.selectedCompany = this.companyList.find(
        (company: any) => company.id == selectedId
      );
      this.company_name = this.selectedCompany
        ? this.selectedCompany?.company_name
        : null;
    } else if (selectionType == 'branch') {
      this.selectedBranchObj = this.branchList.find(
        (elem: any) => elem.id == selectedId
      );
      this.branch_name = this.selectedBranchObj
        ? this.selectedBranchObj?.branch_name
        : null;
    }

    if (
      this.selectedCountry &&
      this.selectedCompany &&
      this.selectedBranchObj
    ) {
      const entityName = `${this.selectedCompany?.abbreviation}-${this.selectedCountry?.country_code}-${this.selectedBranchObj?.branch_code}`;
      this.EntityForm.patchValue({ entity_name: entityName });
    }
  }

  companySelect(selectedCompanyName: any) {
    console.log(selectedCompanyName);
    const formattedCompanyName = selectedCompanyName;
    const selectedCountryId = this.EntityForm.controls['country_id'].value;
    const selectedCountry = this.countryList.find(
      (country: any) => country.countryss_id == selectedCountryId
    );
    if (selectedCountry) {
      const countryCode = selectedCountry.countryss_name
        .substring(0, 3)
        .toUpperCase();
      this.patchEntityName(countryCode, formattedCompanyName);
    }
  }

  patchEntityName(countryCode: string, companyName: string) {
    let comppanyObj = this.companyList?.find(
      (elem: any) => elem.company_id == companyName
    );
    const entityName = `${comppanyObj?.abbreviation}-${countryCode}`;
    this.EntityForm.patchValue({ entity_name: entityName });
  }

  toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  // Branch get start
  branchList: any = [];
  filterBranchlist: any;
  getBranchList() {
    this.config.getListActiveBranchSetup().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.branchList = res.data;
          this.filterBranchlist = this.branchList.slice();
          this.branchVar1 = this.branchList?.map((res: any) => res.branch_name);
          this.branchVar2 = this.branchList;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
}
