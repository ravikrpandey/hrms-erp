import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-statemasterdialog',
  templateUrl: './statemasterdialog.component.html',
  styleUrls: ['./statemasterdialog.component.scss'],
})
export class StatemasterdialogComponent {
  state_id: any;
  countryss_id: any;
  singleStateData: any;
  singleCountryData: any;
  countryList: any;
  countryList2: any;
  countries: any;
  stateForm: any;
  id: number;
  view: boolean;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private dialog: MatDialogRef<StatemasterdialogComponent>,
    private _commonService: CommonService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.id = Number(data.id);
    this.countryss_id = Number(data.id);
    this.id = Number(data.id);
    this.view = false;
    if (data.mode == 'view') {
      this.view = true;
    }
    this.stateForm = this.fb.group({
      country_name: new FormControl(null, [Validators.required]),
      state_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
    });
    if (data.fromDropdown && data.parentId) {
      this.stateForm.get('country_name').setValue(Number(data.parentId));
      this.stateForm.get('country_name').disable();
    }
  }
  ngOnInit() {
    this.getCountryList();
    if (this.id) {
      this.getByIdState();
    }
  }

  getByIdState() {
    this._commonService?.showLoader();
    this._configurationalmasterService.getByIdState(this.id).subscribe(
      (res: any) => {
        this.singleStateData = res.data[0];
        this.stateForm
          .get('country_name')
          .patchValue(this.singleStateData.countryss_id);
        this.stateForm
          .get('state_name')
          .patchValue(this.singleStateData.states_name);
        if (this.data.fromDropdown) {
          this.stateForm.get('country_name').disable();
        }
        this._commonService?.hideLoader();
      },
      (err: any) => {
        this._commonService?.hideLoader();
      },
    );
  }
  getByIdCountry() {
    this._commonService?.showLoader();
    this._configurationalmasterService
      .getByIdCountry(this.countryss_id)
      .subscribe(
        (res: any) => {
          this.singleCountryData = res.data;
          this._commonService?.hideLoader();
        },
        (err: any) => {
          this._commonService?.hideLoader();
        },
      );
  }
  getCountryList() {
    this._commonService?.showLoader();
    this._configurationalmasterService.getAllActivecountry().subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.countryList = res.data;
        this.countryList2 = res.data;
        this.countries = this.countryList.map(
          (value: any) => value.countryss_name,
        );
      },
      (err: any) => {
        this._commonService?.hideLoader();
      },
    );
  }
  countrySearch(e: any) {
    const aa = e;
    let filteredVariable = this.countryList2.filter((item: any) =>
      aa.includes(item.countryss_name),
    );
    this.countryList = filteredVariable;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  confirmDialog() {
    this.dialog.close(this.stateForm.value);
  }

  onSubmitForm() {
    let data = this.stateForm.getRawValue();
    let body: any = {};
    body['states_name'] = data.state_name.trim();
    body['countryss_id'] = data.country_name;

    this._configurationalmasterService.createState(body).subscribe(
      (res: any) => {
        this.toaster.success('State Created Successfully');
        if (this.data.fromDropdown) {
          this.dialog.close(res.data);
        } else {
          this.route.navigate(['/master/configurational-master/state-master']);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err: any) => {
        this.toaster.error('state name all ready exists!', 'Error Message');
      },
    );
  }

  onUpdateForm() {
    let data = this.stateForm.getRawValue();
    let body: any = {};
    body['states_name'] = data.state_name.trim();
    body['countryss_id'] = data.country_name;
    this._configurationalmasterService
      .updateSingleState(this.id, body)
      .subscribe(
        (res: any) => {
          this.toaster.success('State Updated Successfully');
          if (this.data.fromDropdown) {
            this.dialog.close({
              states_id: this.id,
              states_name: body.states_name,
              countryss_id: body.countryss_id,
            });
          } else {
            this.route.navigate([
              '/master/configurational-master/state-master',
            ]);
            this.confirmDialog();
            this.reloadCurrentRoute();
          }
        },
        (err: any) => {
          this.toaster.error('state name all ready exists!', 'Error Message');
        },
      );
  }
}
