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
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent {

  stateForm: FormGroup;
  isOpenDialog: boolean = false;
  countryList: any=[];
  countryList1: any=[];
  countryList2: any=[];
  constructor(
    private dialog: MatDialogRef<StateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public toaster: ToastrService,
    public router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,

  ) {
    this.stateForm = this._fb.group({
      countryss_id: new FormControl(null, [
        Validators.required,
      ]),
      states_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      
    });
  }

  ngOnInit(): void {
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
    this.getAllCountry()
  }


  confirmDialog() {
    this.dialog.close(this.stateForm.value);
  }
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.countryList1 = this.countryList.map(
          (res: any) => res.countryss_name
        );
        this.countryList2 = this.countryList;
      });
  }


  countrySearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.countryList2.filter((item: any) =>
      tempVal.includes(item.countryss_name)
    );
    this.countryList = filteredVariable;
  }


  onSubmit(data: any) {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }
    this._configurationalmasterService.createState(data.value).subscribe(
      (res: any) => {
        if (res) {
          if (res.code == 201) {
            this.toaster.warning('State Name Of This Country Already Exists!');
          } else {
            this.toaster.success('State Added Successfully');
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

