import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { environment } from 'src/app/environments/environment';
import { BasicDetailsDialog } from './basic-details-dialog/basic-details-dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent {
  dataObj: any = {};
  baseUrl: any;
  entityList: any;
  basicForm: FormGroup;
  constructor(
    private activeroute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private dialog: MatDialog,
    private fb: FormBuilder,


  ) {
    this.baseUrl = environment.serverUrl;
    this.basicForm = this.fb.group({
      emp_personal_email: ['', [Validators.email, Validators.required]],
      country_code: new FormControl(null, [Validators.required]),
      contact_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
    })
  }


  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      let employee_id = params?.employee_id;
      if (employee_id) {
        this.getByIdUse(employee_id);
      }
    });

  }

  basicFormPatch(getData: any) {

    this.basicForm.patchValue({

      emp_personal_email: getData?.emp_personal_email,
      country_code: getData?.country_code,
      contact_number: getData?.contact_number,

    });
  }

  getByIdUse(id: any) {

    this._empRegistration.getByUserId(id).subscribe((res: any) => {
      this.dataObj = res.data;
    });
  }

  viewImg() {
    window.open(this.baseUrl + '/' + this.dataObj?.employee_photo, '_blank');
  }

  openEmailDialog(): void {
    const dialogRef = this.dialog.open(BasicDetailsDialog, {
      width: '400px',
      data: {
        type: 'email',
        email: this.dataObj?.emp_personal_email,
        employee_id: this.dataObj?.employee_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.email) {
        this.dataObj.emp_personal_email = result.email;
      }
    });
  }

  openContactDialog(): void {
    const dialogRef = this.dialog.open(BasicDetailsDialog, {
      width: '400px',
      data: {
        type: 'contact',
        contact_number: this.dataObj?.contact_number,
        country_code: this.dataObj?.country_code,
        employee_id: this.dataObj?.employee_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.contact_number) {
        this.dataObj.contact_number = result.contact_number;
        this.dataObj.country_code = result.country_code;
      }
    });
  }
}
