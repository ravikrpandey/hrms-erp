import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-create-new-customer',
  templateUrl: './create-new-customer.component.html',
  styleUrls: ['./create-new-customer.component.scss'],
})
export class CreateNewCustomerComponent implements OnInit {
  proposalForm: FormGroup;
  @Input() proposalTypeList: any[] = [];
  @Input() countryList: any[] = [];
  @Input() createdByList: any = [];
  stateList: any[] = [];
  cityList: any[] = [];
  postOffice: any[] = [];
  @Input() leadSourceList: any = [];
  salesEmployeeList: any = [];
  state: any;
  titleSelect: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $common: CommonService,
    private _empRegistration: EmpRegistrationService,
    private $proposal: ProposalService,
    private router: Router
  ) {
    // this.route.queryParams.subscribe((params: any) => {
    //   this.actionType = params?.actionType;
    //   this.existing_type = params.type;
    //   this.existingData = params.existing;
    // });
    this.proposalForm = this.fb.group({
      proposal_type_id: new FormControl(null),
      company_name: new FormControl(null, Validators.required),
      contact_person_name: new FormControl(null, Validators.required),
      contact_number: new FormControl(null),
      mail_id: new FormControl(null, [Validators.required, Validators.email]),
      source_name: new FormControl(null),
      country_id: new FormControl(101, Validators.required),
      state_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      postal_address: new FormControl(null),
      lead_source: new FormControl(null, [Validators.required]),
      created_by: new FormControl(null, Validators.required),
      created_by_id: new FormControl(null),
      pincode: new FormControl(null, Validators.required),
      financial_year_id: new FormControl(null, Validators.required),
      entity_id: new FormControl(null, Validators.required),
      employee_id: new FormControl(null, Validators.required),
      title: new FormControl('')
    });
  }
routerParams:any;
  ngOnInit(): void {
    const entityId = localStorage.getItem('selectedEntityId');
    const financial_year_id = localStorage.getItem('financial_id');
    const userLoginId = localStorage.getItem('EmpMainId');

this.route.queryParams.subscribe((params: any) => {
  console.log(params);
  this.routerParams = params;
})
    this.proposalForm.patchValue({
      financial_year_id: financial_year_id,
      entity_id: entityId,
      employee_id: userLoginId,
    });
  }


  getProposalType() {
    this._configurationalMasterService.getProposalType().subscribe(
      (res: any) => {
        this.proposalTypeList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  proposalSelection(e: any) {
    // if (e.value === 'EXPORT') {
    //   this.hideTableColumns = true;
    // } else {
    //   this.hideTableColumns = false;
    // }
  }

  allowOnlyNumber(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      if (res) {
        this.countryList = res.data;
      }
    });
  }

  getAllState(countryId: any) {
    this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
      if (res && res?.data) {
        this.stateList = res?.data;
      }
    });
  }

  getAllCity(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
      if (res && res?.data) {
        this.cityList = res?.data;
        let country = this.proposalForm.get('country_id')?.value;
        if (this.state && country == 101) {
          let city = this.cityList.find(
            (x: any) => x.city_name == this.state[1]
          );

          if (!city) {
            let data = {
              city_name: this.state[1],
              states_id: stateId,
            };
            this._configurationalMasterService.createCity(data).subscribe({
              next: (res: any) => {
                console.log(res.data);
                this.proposalForm
                  .get('city_id')
                  ?.patchValue(res?.data?.city_id);
                this.proposalForm
                  .get('states_id')
                  ?.patchValue(res?.data?.states_id);
              },
              error: (error) => { },
            });
          } else {
            this.proposalForm.get('states_id')?.patchValue(city?.states_id);
            this.proposalForm.get('city_id')?.patchValue(city.city_id);
          }
        }
      }
    });
  }

  // fetchPinDetails() {
  //   let pin = this.proposalForm.get('pincode')?.value;
  //   let country = this.proposalForm.get('country_id')?.value;

  //   if (!pin || !country) return;
  //   // State list
  //   this.getAllState(country);
  //   this.$common.getPostOfficeByPincode(pin).subscribe(
  //     (response: any) => {
  //       if (response.PostOffice && response.PostOffice.length > 0) {
  //         this.postOffice = response.PostOffice;
  //         const post = response.PostOffice[0];

  //         let state_id = this.stateList.find(
  //           (x: any) => x.states_name.toLowerCase() === post.State.toLowerCase()
  //         )?.states_id;

  //         if (state_id) {
  //           this.proposalForm.get('state_id')?.patchValue(state_id);
  //           this.getAllCity(state_id);

  //           // City patch
  //           setTimeout(() => {
  //             let city_id = this.cityList.find(
  //               (x: any) =>
  //                 x.city_name.toLowerCase() === post.District.toLowerCase()
  //             )?.city_id;

  //             if (city_id) {
  //               this.proposalForm.get('city_id')?.patchValue(city_id);
  //             }
  //           }, 800);
  //         }
  //       } else {
  //         this.postOffice = [];
  //       }
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error(error);
  //     }
  //   );
  // }

  fetchPinDetails() {
    let pin = this.proposalForm.get('pincode')?.value;
    let country = this.proposalForm.get('country_id')?.value;

    if (!pin || !country) return;
    // State list 
    this.getAllState(country);
    this.$common.getPostOfficeByPincode(pin).subscribe(
      (response: any) => {
        if (response.PostOffice && response.PostOffice.length > 0) {
          this.postOffice = response.PostOffice;
          const post = response.PostOffice[0];

          let state_id = this.stateList.find(
            (x: any) => x.states_name.toLowerCase() === post.State.toLowerCase()
          )?.states_id;

          if (state_id) {
            this.proposalForm.get('state_id')?.patchValue(state_id);
            this.proposalForm.get('state_id')?.disable();
            this.getAllCity(state_id);

            // City patch 
            setTimeout(() => {
              let city_id = this.cityList.find(
                (x: any) => x.city_name.toLowerCase() === post.District.toLowerCase()
              )?.city_id;

              if (city_id) {
                this.proposalForm.get('city_id')?.patchValue(city_id);
                this.proposalForm.get('city_id')?.disable();
              }
            }, 800);
          }
        } else {
          this.postOffice = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  selectPostal(event: any) {
    this.proposalForm.get('postal_address')?.patchValue(event);
  }

  keyPress(event: Event | any) {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  getLeadSource(financial_year_id: any, entity_id: any) {
    this.$proposal.getLeadSource(financial_year_id, entity_id).subscribe({
      next: (res) => {
        this.leadSourceList = res.data;
      },
      error: (err) => {
        console.error(err.error.message);
        return;
      },
    });
  }

  saveCustomer() {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }
    let data = this.proposalForm.getRawValue();
    data.dealer_id = this.routerParams.dealer;
    this.$proposal.createNewCustomer(data).subscribe({
      next: (res: any) => {
        console.log(res);
        // customer_id
        this.router.navigate(['/master/sales/create-proposal'], {
          queryParams: {
            client_id: res.customer_id,
            type: 'existing_client',
            actionType: 'create',
            new_customer: 'yes',
            lead_source: this.proposalForm.get('lead_source')?.value,
            created_by: this.proposalForm.get('created_by')?.value,
            created_by_id: this.proposalForm.get('created_by_id')?.value,
            proposal_type_id: this.proposalForm.get('proposal_type_id')?.value,
            dealer:this.routerParams.dealer?this.routerParams.dealer:null
          },
        });
        // this.$common.openSnackBar('Customer created successfully', 'Close');
        this.proposalForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.error.message);
        // this.$common.openSnackBar(err.error.message, 'Close');
        return;
      },
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  selectCreatedBy(createdBy: string) {
    if (createdBy === 'Any Other') {
      this.proposalForm
        .get('created_by_id')
        ?.setValidators([Validators.required]);
      this.$proposal.getSalesCustomers().subscribe({
        next: (res) => {
          this.salesEmployeeList = res.data;
        },
        error: (err) => {
          // this.toast.error(err.error.message);
          return;
        },
      });
    } else {
      this.salesEmployeeList = [];
      this.proposalForm.get('created_by_id')?.clearValidators();
    }
    this.proposalForm.get('created_by_id')?.updateValueAndValidity();
  }

  typeChange(event: any) {
    console.log('Selected title:', event);
    this.titleSelect = event;
  }
}
