import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import Swal from 'sweetalert2';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
// import { DataService } from 'src/app/@shared/services/query-params/data.service';

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
// function noWhitespaceValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: boolean } | null => {
//     const value = control.value as string;
//     if (value && (value.startsWith(' ') || value.endsWith(' '))) {
//       // Return an error object to indicate validation failure
//       return { hasWhitespace: true };
//     }
//     // Return null if validation passes
//     return null;
//   };
// }


@Component({
  selector: 'app-create-field-value',
  templateUrl: './create-field-value.component.html',
  styleUrls: ['./create-field-value.component.scss']
})
export class CreateFieldValueComponent {
  leadValueForm: FormGroup;
  icon: boolean = true;
  leadFormSetupId: any;
  isDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private $crm: CrmService,
    private location: Location,
    // private dataService: DataService
  ) {
    this.leadValueForm = this.fb.group({
      // country_id: new FormControl(null, Validators.required),
      leadValueList: new FormArray([
        new FormGroup({
          field_value: new FormControl(null, [Validators.pattern(/^[a-zA-Z\s]*$/), noLeadingSpaces()]),
        }),
      ]),
    });
  }

  resolvedData: any;
  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.leadFormSetupId = params.id;
      if (this.leadFormSetupId) {
        this.getFieldValue();
      }

      // this.resolvedData = this.dataService.getResolvedData();
      // console.log(this.resolvedData);
    });
  }

  get CF_1(): any {
    return this.leadValueForm.controls;
  };

  addrow() {
    <FormArray>this.CF_1.leadValueList.push(
      new FormGroup({
        field_value: new FormControl(null, [Validators.pattern(/^[a-zA-Z\s]*$/), noLeadingSpaces()]),
      }),
    );

    console.log(this.leadValueForm);
  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.leadValueList.length >= 1) {
      this.CF_1.leadValueList.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }

  onSubmit() {
    try {

      if (this.leadValueForm.status === 'INVALID') {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      const leadValueList = this.leadValueForm.get('leadValueList') as FormArray;
      let req: any = [];
      leadValueList?.value?.map((item: any) => {
        if (item?.field_value) {
          req.push({ field_value: item?.field_value });
        }
      })
      this.$crm.createFormFieldValue(req, this.leadFormSetupId).subscribe((response: any) => {
        if (response) {
          this.toast.success('Field value Created successfully..');
          this.goBack();
          // this.leadValueForm.reset();
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  fieldRecord: any = {};
  getFieldValue() {
    try {
      this.$crm.getStatusName(this.leadFormSetupId).subscribe((response: any) => {
        if (response) {
          this.fieldRecord = response;
          let list = response?.data;
          if (list?.length != 0) {
            list?.map((item: any) => {
              if ((this.fieldRecord?.field_detail?.field_name == 'Status') &&
                (item.field_value == 'Not Intrested' ||
                  item.field_value == 'Follow-Up' ||
                  item.field_value == 'Deal Close' ||
                  item.field_value == 'Proposal Shared')) {
                item.isDisabled = true
              }
            })
            this.CF_1.leadValueList = this.patchData(list);
          }
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          //console.log(k, 'kkkkkkk');

          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };

  goBack() {
    this.location.back();
  }

}
