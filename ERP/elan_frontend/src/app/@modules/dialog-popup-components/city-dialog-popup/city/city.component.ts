import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent {
  cityForm: FormGroup;
  isOpenDialog: boolean = false;
  stateList: any=[];
  stateList1: any=[];
  stateList2: any=[];
  constructor(
    private dialog: MatDialogRef<CityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public toaster: ToastrService,
    public router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,

  ) {
    this.cityForm = this._fb.group({
      states_id: new FormControl(null, [
        Validators.required,
      ]),
      city_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      
    });
  }

  ngOnInit(): void {
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
    this.getAllStatesData()
  }


  confirmDialog() {
    this.dialog.close(this.cityForm.value);
  }
  getAllStatesData() {
    this._empRegistration.getAllStatesData().subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateList1 = this.stateList.map(
          (res: any) => res.states_name
        );
        this.stateList2 = this.stateList;
      });
  }


  stateSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.stateList2.filter((item: any) =>
      tempVal.includes(item.states_name)
    );
    this.stateList = filteredVariable;
  }


  onSubmit(data: any) {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      return;
    }
    this._configurationalmasterService.createCity(data.value).subscribe(
      (res: any) => {
        if (res) {
          if (res.code == 201) {
            this.toaster.warning('City Name Of This State Already Exists!!');
          } else {
            this.toaster.success('City Added Successfully');
            this.dialog.close();
            if (this.isOpenDialog === true) {
              this.confirmDialog();
            }
          }
        }
      },
      (err: any) => {
        if (err.status == 500) {
          this.toaster.error('Something went Wrong!');
        }
      }
    );
  }
}