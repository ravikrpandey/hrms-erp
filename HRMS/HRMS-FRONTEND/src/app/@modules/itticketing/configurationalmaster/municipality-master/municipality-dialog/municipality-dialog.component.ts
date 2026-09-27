import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DatePipe } from '@angular/common';


function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}




@Component({
  selector: 'app-municipality-dialog',
  templateUrl: './municipality-dialog.component.html',
  styleUrls: ['./municipality-dialog.component.scss']
})
export class MunicipalityDialogComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  startYear = new Date();
  endYear= new Date();
  entity_Id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<MunicipalityDialogComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      department_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      amount: new FormControl(null, [Validators.required]),
      startYear: new FormControl(null, [Validators.required]),
      endYear: new FormControl(null, [Validators.required]),

    });
  }
  ngOnInit() {
    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    let entity_id:any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity_id)
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if(this.departmentId){
      this._configurationalMasterService.get_MunicipalityById(this.departmentId).subscribe((res: any) => {
        this.departmentData = res.data;
        // 
        // const date = new Date(this.departmentData?.date);
        // const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
          this.departmentForm.patchValue({
            department_name: this.departmentData?.name_of_municipality,
            startYear : this.departmentData?.start_date,
            endYear : this.departmentData?.end_date,
            amount: this.departmentData?.amount,
          })
      });
    }
  }

  onSubmitForm() {
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      name_of_municipality: val.department_name,
      amount : val.amount,
      entity_id : this.entity_Id,
      start_date:val.startYear,
      end_date:val.endYear,
    };
    this._configurationalMasterService.createMunicipality(data).subscribe(
      (res: any) => {
        if(res.message === "Municipality Name is Already Exits!"){
        this.toast.warning('Municipality Name Already Exists!');
      }
      else{
        this.toast.success('Municipality Added Successfully');
        this.route.navigate([
          'master/configurational-master/municipality',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 201){
          this.toast.error('Municipality Name  Already Exists!');
        }else if (err.error.message) {
          this.toast.error(err.error.message);
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      name_of_municipality: val.department_name,
      amount : val.amount,
      entity_id : 1,
      start_date :val.startYear,
      end_date:val.endYear
    };
    this._configurationalMasterService.update_MunicipalityById(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Municipality Name is Already Exits!"){
        this.toast.warning('Municipality Name Already Exists!');
      }
      else{
        this.toast.success('Municipality Update Successfully');
      }
        this.route.navigate([
          'master/configurational-master/municipality',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409){
          this.toast.error('Municipality Name is Already Exits!');
        }else if (err.error.message) {
          this.toast.error(err.error.message);
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.departmentForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  chosenYearHandler(normalizedYear: moment.Moment, datepicker: any) {
    this.departmentForm.controls['startYear'].setValue(normalizedYear);
    datepicker.close();
  }

  
}
