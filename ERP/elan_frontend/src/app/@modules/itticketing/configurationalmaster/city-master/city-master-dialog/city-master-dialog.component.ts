import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-city-master-dialog',
  templateUrl: './city-master-dialog.component.html',
  styleUrls: ['./city-master-dialog.component.scss'],
})
export class CityMasterDialogComponent {
  stateVar: any = [];
  city_id: any;
  singleCityData: any;

  view: any;
  cityForm: FormGroup;
  getStateId: any;
  stateVar2: any;
  route: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<CityMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    public toaster: ToastrService,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.city_id = Number(data?.id);
    this.cityForm = this.fb.group({
      city_name: new FormControl(null, [Validators.required]),
      states_id: new FormControl(null, [Validators.required]),
    });

    if (this.city_id) {
      this._configurationalmasterService
        .getByIdCity(this.city_id)
        .subscribe((response: any) => {
          this.cityForm.patchValue({
            city_name: response.data?.city_name,
            states_id: response.data?.states_id,
          });
          if (this.data?.fromDropdown) {
            this.cityForm.get('states_id')?.disable();
          }
          this.getStateId = response.data?.states_id;
        });
      this._configurationalmasterService
        .getByIdState(this.getStateId)
        .subscribe((response: any) => {
          this.StateDataList = response.data[0];
        });
    }

    if (data?.fromDropdown && data?.parentId) {
      this.cityForm.get('states_id')?.setValue(Number(data.parentId));
      this.cityForm.get('states_id')?.disable();
    }
  }
  ngOnInit() {
    this.getStateList();
    this.getByIdCity();
    this.view = this.data?.view;
  }

  getByIdCity() {
    this._configurationalmasterService
      .getByIdCity(this.city_id)
      .subscribe((res: any) => {
        this.singleCityData = res.data;
      });
  }

  stateFilter(e: any) {
    const aa = e;
    let filteredVariable = this.stateVar2.filter((item: any) =>
      aa.includes(item.states_name),
    );
    this.StateDataList = filteredVariable;
  }

  onSubmitForm() {
    const rawVal = this.cityForm.getRawValue();
    if (rawVal.city_name) {
      rawVal.city_name = rawVal.city_name.trim();
    }
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      this.toaster.error(
        'Required fields should not be empty.',
        'Error Occurred!',
      );
      return;
    }
    this._configurationalmasterService.createCity(rawVal).subscribe(
      (res: any) => {
        if (res) {
          if (res.message === 'City Name is Already Exists!') {
            this.toaster.warning('City Name Already Exists!');
          } else {
            this.toaster.success('City Added Successfully');
            if (this.data?.fromDropdown) {
              this.dialog.close(res.data);
            } else {
              this.dialog.close();
              window.location.reload();
            }
          }
        }
      },
      (err: any) => {
        this.toaster.error(err.error.message);
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('City Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      },
    );
  }
  StateDataList: any = [];
  getStateList() {
    this._empRegistration.getAllstate().subscribe((res: any) => {
      if (res && res?.data) {
        this.StateDataList = res?.data;
        this.stateVar = this.StateDataList.map((res: any) => res.states_name);
        this.stateVar2 = this.StateDataList;
      }
    });
  }

  onUpdateForm() {
    const rawVal = this.cityForm.getRawValue();
    if (rawVal.city_name) {
      rawVal.city_name = rawVal.city_name.trim();
    }
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      this.toaster.error(
        'Required fields should not be empty.',
        'Error Occurred!',
      );
      return;
    }
    this._configurationalmasterService
      .updateSingleCity(this.city_id, rawVal)
      .subscribe(
        (res: any) => {
          if (res) {
            if (res.message === 'City Name is Already Exists!') {
              this.toaster.warning('City Name Already Exists!');
            } else {
              this.toaster.success('City Updated Successfully');
              if (this.data?.fromDropdown) {
                this.dialog.close({
                  city_id: this.city_id,
                  city_name: rawVal.city_name,
                  states_id: rawVal.states_id,
                });
              } else {
                this.dialog.close();
                window.location.reload();
              }
            }
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toaster.error('City Name Already Exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        },
      );
  }
}
